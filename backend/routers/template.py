import json
from typing import Optional
import uuid
from fastapi import APIRouter
from fastapi import Depends, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import EmailStr
from sqlalchemy.orm import Session
import schemas
from db import models
from utils.db_setup import get_db
from utils.thompson_algo import ThompsonSampling
from utils.gpts import GPTs
from utils.prompts.gpt_prompts import template_system_prompt


router = APIRouter()


@router.get("/update/{id}/", response_model=schemas.TemplateResponse)
def update_template_values(
    id: uuid.UUID, 
    subset_id: uuid.UUID,
    email: EmailStr,
    click: Optional[bool] = None,
    db: Session = Depends(get_db)
):

    db_template = db.query(models.Template).filter(models.Template.id == id).first()
    if not db_template:
        raise HTTPException(status_code=404, detail="Email template not found")
    
    db_subset = (
        db.query(models.TemplateICPPerformance)
        .filter(
            models.TemplateICPPerformance.id == subset_id,
        )
        .first()
    )

    if not db_subset:
        raise HTTPException(status_code=404, detail="ICP subset not found")

    db_click_track = db.query(models.ClickTrack).filter(
        models.ClickTrack.template_id == db_template.id,
        models.ClickTrack.user_email == email
    ).first()

    if db_click_track:
        return RedirectResponse(url="https://calendly.com/")

    sampling = ThompsonSampling()
    sampling.update(db_template, db_subset, click)

    new_click_track = models.ClickTrack(
        template_id=db_template.id,
        clicked=True,
        user_email=email
    )

    db.add(new_click_track)

    db.commit()
    db.refresh(db_template)

    return RedirectResponse(url="https://calendly.com/")

@router.post("/create/", response_model=schemas.TemplatesResponse)
def add_templates(template_data: schemas.TemplateCreate, project_id: uuid.UUID, db: Session = Depends(get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    templates = []

    for template in template_data["templates"]:
        new_template = models.Template(
            project_id=project_id,
            email_template=template.email_template,
            email_subject=template.email_subject
        )

        db.add(new_template)
        templates.append(new_template)

    db.commit()
    db.refresh(new_template)

    return templates

@router.post("/generate")
def generate_templates(template_data: schemas.TemplateDataCreate):
    model = GPTs(template_system_prompt(
        template_data.pain_point, 
        template_data.offer_summary, 
        template_data.cta_line
    ))

    try:
        response = model.generate_template()
        data = json.loads(response)

        if data:
            return response
        else:
            raise HTTPException(status_code=408, detail="Network Error")
    except:
        raise HTTPException(status_code=408, detail="Network Error")

    return

@router.get("/{id}", response_model=schemas.TemplateResponse)
def get_template(id: uuid.UUID, user_id, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_template = db.query(models.Template).filter(models.Template.id == id).first()

    if not db_template:
        raise HTTPException(status_code=404, detail="Template not found")

    return db_template