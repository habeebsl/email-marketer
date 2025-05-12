import uuid, json
from fastapi import APIRouter
from fastapi import Depends, HTTPException
from pydantic import EmailStr
from sqlalchemy.orm import Session
import schemas
from db import models
from utils.db_setup import get_db
from utils.gpts import GPTs
from utils.prompts import gpt_prompts
from utils.thompson_algo import ThompsonSampling
from utils.email_utils import SesMailSender

router = APIRouter()

@router.post("/create/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_project = models.Project(
        owner_id=user_id,
        project_name=project.project_name
    )

    db.add(new_project)
    db.flush()

    for template in project.templates:
        new_template = models.Template(
            project_id=new_project.id,
            email_template=template.email_template,
            email_subject=template.email_subject
        )
        db.add(new_template)

    db.commit()
    db.refresh(new_project)

    return new_project

@router.get("/{id}/", response_model=schemas.ProjectResponse)
def get_project(id: uuid.UUID, user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(
        models.Project.id == id,
        models.Project.owner_id == user_id
    ).first()
    
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return db_project

@router.get("/", response_model=schemas.ProjectsResponse)
def get_projects(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_projects = db.query(models.Project).filter(models.Project.owner_id == user_id).all()
    return {"projects": db_projects}

@router.post("/send/{id}/")
def send_email(id: uuid.UUID, reply_to: EmailStr, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_templates = db.query(models.Template).filter(models.Template.project_id == id).all()
    if not db_templates:
        raise HTTPException(status_code=404, detail="Templates not found")
    
    db_subsets = db.query(models.ICPSubset).filter(models.ICPSubset.project_id == id).all()
    if not db_subsets:
        raise HTTPException(status_code=404, detail="ICP subsets not found")
    
    db_user = db.query(models.User).filter(models.User.id == db_project.owner_id).first() 

    ses = SesMailSender()

    test_emails = ses.get_emails()

    for email_data in test_emails:
        # Recalculate for each email
        sampling = ThompsonSampling()
        selected_template = sampling.select_arm(db_templates)
        
        template_subsets = db.query(models.TemplateICPPerformance).filter(
            models.TemplateICPPerformance.template_id == selected_template.id
        ).all()

        subset_ids = [s.icp_subset_id for s in template_subsets]

        for subset in db_subsets:
            if subset.id not in subset_ids:
                new_t_subset = models.TemplateICPPerformance(
                    template_id=selected_template.id,
                    icp_subset_id=subset.id,
                )
                db.add(new_t_subset)
                db.flush()
                template_subsets.append(new_t_subset)

        selected_icp = sampling.select_icp(template_subsets)

        ses.send_email(
            db_user.name,
            email_data["recipient_name"].split()[0],
            email_data["recipient_company"],
            email_data["recipient_job_title"],
            email_data["email"],
            selected_template,
            selected_icp,
            reply_to,
        )

        sampling.update(selected_template, selected_icp)
        db.flush()

    db.commit()
    db.refresh(db_project)
    return {"status": 200}


@router.post("/icps/generate/")
def generate_icps(project_data: schemas.ProjectDataBase):
    
    model = GPTs(gpt_prompts.icp_system_prompt(
        project_data.pain_point, 
        project_data.offer_summary
    ))

    try:
        response = model.generate_icp()
        
        data = json.loads(response)

        if data:
            return response
        else:
            raise HTTPException(status_code=408, detail="Network Error")
    except:
        raise HTTPException(status_code=408, detail="Network Error")
    

@router.post("/icps/create/", response_model=schemas.ICPsDataResponse)
def add_icps(icp_data: schemas.ICPsDataCreate, project_id: uuid.UUID, db: Session = Depends(get_db)):

    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        for icp in icp_data.icps:
            new_icp = models.ICPSubset(
                name=icp,
                project_id=project_id
            )
            db.add(new_icp)
        
        db.commit()
        db.refresh(db_project)
    except:
        raise HTTPException(status_code=408, detail="Network Error")
    
    new_icps = db.query(models.ICPSubset).filter(models.ICPSubset.project_id == project_id).all()

    return schemas.ICPsDataResponse(icps=[schemas.ICPSubsetResponse.model_validate(icp) for icp in new_icps])