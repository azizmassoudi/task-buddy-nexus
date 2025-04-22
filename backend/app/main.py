from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import logging

from .database import get_db
from .models.base import User, Service, Job, Message
from .schemas import (
    UserCreate, User as UserSchema,
    ServiceCreate, Service as ServiceSchema,
    JobCreate, Job as JobSchema,
    MessageCreate, Message as MessageSchema,
    Token
)
from .core.auth import (
    get_current_user,
    create_access_token,
    get_password_hash,
    verify_password,
    oauth2_scheme
)
from datetime import timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TaskConnect API",
    description="Backend API for TaskConnect platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to TaskConnect API",
        "documentation": "/docs",
        "endpoints": {
            "auth": {
                "login": "/auth/token",
                "register": "/users/"
            },
            "services": {
                "list": "/services/",
                "create": "/services/"
            },
            "jobs": {
                "list": "/jobs/",
                "create": "/jobs/"
            },
            "messages": {
                "list": "/messages/{job_id}",
                "create": "/messages/"
            }
        }
    }

# Authentication endpoints
@app.post("/auth/token", response_model=Token)
async def login_for_access_token(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, str(user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# User endpoints
@app.post("/users/", response_model=UserSchema)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        role=user.role,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Service endpoints
@app.post("/services/", response_model=ServiceSchema)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_service = Service(**service.dict(), owner_id=current_user.id)
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.get("/services/", response_model=List[ServiceSchema])
def read_services(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    services = db.query(Service).offset(skip).limit(limit).all()
    return services

# Job endpoints
@app.post("/jobs/", response_model=JobSchema)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_job = Job(**job.dict(), client_id=current_user.id, status="pending")
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@app.get("/jobs/", response_model=List[JobSchema])
def read_jobs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    jobs = db.query(Job).filter(Job.client_id == current_user.id).offset(skip).limit(limit).all()
    return jobs

# Message endpoints
@app.post("/messages/", response_model=MessageSchema)
def create_message(
    message: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_message = Message(**message.dict(), sender_id=current_user.id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/messages/{job_id}", response_model=List[MessageSchema])
def read_messages(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    messages = db.query(Message).filter(Message.job_id == job_id).all()
    return messages 