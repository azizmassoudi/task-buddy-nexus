from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routers import auth, services, jobs, messages
from app.database import engine
from app.models.base import Base

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="TaskConnect API",
    description="Backend API for TaskConnect platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(services.router, prefix="/services", tags=["services"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])

@app.get("/")
async def root():
    return {"message": "Welcome to TaskConnect API"} 