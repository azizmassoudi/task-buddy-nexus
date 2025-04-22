from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from ..database import get_db
from ..models.base import Message, User, Job
from ..schemas import MessageCreate, Message as MessageSchema
from ..core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=MessageSchema)
def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_user = db.query(User).filter(User.username == current_user).first()
    db_job = db.query(Job).filter(Job.id == message.job_id).first()
    
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if db_job.client_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to send messages for this job")
    
    db_message = Message(
        **message.dict(),
        sender_id=db_user.id
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/job/{job_id}", response_model=List[MessageSchema])
def read_messages(
    job_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_user = db.query(User).filter(User.username == current_user).first()
    db_job = db.query(Job).filter(Job.id == job_id).first()
    
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if db_job.client_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view messages for this job")
    
    messages = db.query(Message).filter(Message.job_id == job_id).offset(skip).limit(limit).all()
    return messages

@router.get("/{message_id}", response_model=MessageSchema)
def read_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db_user = db.query(User).filter(User.username == current_user).first()
    db_job = db.query(Job).filter(Job.id == db_message.job_id).first()
    
    if db_job.client_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this message")
    
    return db_message

@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_message = db.query(Message).filter(Message.id == message_id).first()
    if db_message is None:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db_user = db.query(User).filter(User.username == current_user).first()
    if db_message.sender_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this message")
    
    db.delete(db_message)
    db.commit()
    return {"message": "Message deleted successfully"} 