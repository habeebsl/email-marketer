from fastapi import APIRouter
from fastapi import Depends, HTTPException
from pydantic import EmailStr
from sqlalchemy.orm import Session
import schemas
from db import models
from utils.db_setup import get_db


router = APIRouter()

@router.post("/create/", response_model=schemas.UserResponse)
def create_account(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    else:
        new_user = models.User(**user.model_dump())
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

    return new_user

@router.get("/verify/", response_model=schemas.UserResponse)
def verify_user(email: EmailStr, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return db_user