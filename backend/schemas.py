import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, field_validator


class ICPSubsetBase(BaseModel):
    name: str

class ICPSubsetCreate(ICPSubsetBase):
    pass

class ICPSubsetResponse(ICPSubsetBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

class ICPsDataCreate(BaseModel):
    icps: list[str]

class ICPsDataResponse(BaseModel):
    icps: list[ICPSubsetResponse]

    class Config:
        from_attributes = True

class PerformanceRecords(BaseModel):
    id: uuid.UUID
    total_sent: int
    successes: int
    failures: int
    subset_name: str

    @field_validator('subset_name', mode='before')
    @classmethod
    def get_subset_name(cls, v, values, **kwargs):
        if hasattr(v, 'icp_subset') and v.icp_subset:
            return v.icp_subset.name
        return v

    class Config:
        from_attributes = True
        populate_by_name = True


# --- TEMPLATE MODELS ---
class TemplateBase(BaseModel):
    email_subject: str
    email_template: str

class TemplateCreate(BaseModel):
    templates: list[TemplateBase]

class TemplateResponse(TemplateBase):
    id: uuid.UUID
    updated_at: datetime
    successes: int
    failures: int
    total_sent: int
    performance_records: list[PerformanceRecords]

    class Config:
        from_attributes = True

class TemplatesResponse(BaseModel):
    templates: list[TemplateResponse]

# --- PROJECT MODELS ---
class ProjectBase(BaseModel):
    project_name: str

class ProjectCreate(ProjectBase):
    templates: List[TemplateBase]
    pass

class ProjectResponse(ProjectBase):
    id: uuid.UUID
    templates: List[TemplateResponse]
    icp_subsets: list[ICPSubsetResponse]
    updated_at: datetime

    class Config:
        from_attributes = True

class ProjectsResponse(BaseModel):
    projects: list[ProjectResponse]


# --- USER MODELS ---
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: uuid.UUID
    projects: List[ProjectResponse] = []

    class Config:
        from_attributes = True


class ProjectDataBase(BaseModel):
    offer_summary: str
    pain_point: str
    
class TemplateDataCreate(ProjectDataBase):
    cta_line: str