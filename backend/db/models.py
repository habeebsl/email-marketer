import uuid
from sqlalchemy.sql import func
from sqlalchemy import Boolean, Column, DateTime, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    
    projects = relationship("Project", back_populates="owner", cascade="all, delete")


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    project_name = Column(String)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),  default=func.now(), onupdate=func.now())

    templates = relationship("Template", back_populates="project", cascade="all, delete")
    icp_subsets = relationship("ICPSubset", back_populates="project", cascade="all, delete")

    owner = relationship("User", back_populates="projects")


class Template(Base):
    __tablename__ = "templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email_subject = Column(String)
    email_template = Column(String)
    total_sent = Column(Integer, default=0)
    successes = Column(Integer, default=0)
    failures = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True),  default=func.now(), onupdate=func.now())
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    project = relationship("Project", back_populates="templates")
    performance_records = relationship("TemplateICPPerformance", back_populates="template", cascade="all, delete")


class ICPSubset(Base):
    __tablename__ = "icp_subsets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)

    performance_records = relationship("TemplateICPPerformance", back_populates="icp_subset")
    project = relationship("Project", back_populates="icp_subsets")


class TemplateICPPerformance(Base):
    __tablename__ = "template_icp_performance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)

    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="CASCADE"))
    icp_subset_id = Column(UUID(as_uuid=True), ForeignKey("icp_subsets.id", ondelete="CASCADE"))

    total_sent = Column(Integer, default=0)
    successes = Column(Integer, default=0)
    failures = Column(Integer, default=0)

    template = relationship("Template", back_populates="performance_records")
    icp_subset = relationship("ICPSubset", back_populates="performance_records")

    @property
    def subset_name(self):
        return self.icp_subset.name if self.icp_subset else None


class ClickTrack(Base):
    __tablename__ = "click_tracks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    template_id = Column(UUID, nullable=False)
    user_email = Column(String, nullable=False)
    clicked = Column(Boolean, default=False)
    clicked_at =  Column(DateTime(timezone=True), server_default=func.now())