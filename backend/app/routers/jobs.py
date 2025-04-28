from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from ..database import get_db
from ..models.base import Job, User
from ..schemas import JobCreate, Job as JobSchema
from ..core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=JobSchema)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    db_job = Job(**job.dict(), client_id=current_user.id, status="pending")
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/", response_model=List[JobSchema])
def read_jobs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    jobs = db.query(Job).filter(Job.client_id == current_user.id).offset(skip).limit(limit).all()
    return jobs

@router.get("/{job_id}", response_model=JobSchema)
def read_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_user = db.query(User).filter(User.username == current_user).first()
    if db_job.client_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this job")
    
    return db_job

@router.put("/{job_id}/status", response_model=JobSchema)
def update_job_status(
    job_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_user = db.query(User).filter(User.username == current_user).first()
    if db_job.client_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    db_job.status = status
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_user = db.query(User).filter(User.username == current_user).first()
    if db_job.client_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    
    db.delete(db_job)
    db.commit()
    return {"message": "Job deleted successfully"} 