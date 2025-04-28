from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
from pathlib import Path
import logging

from .routers import auth, services, jobs, messages
from .database import engine
from .models.base import Base

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Get the absolute path to the uploads directory
BASE_DIR = Path(__file__).parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

logger.debug(f"Base directory: {BASE_DIR}")
logger.debug(f"Upload directory: {UPLOAD_DIR}")
logger.debug(f"Upload directory exists: {UPLOAD_DIR.exists()}")
logger.debug(f"Upload directory permissions: {os.access(UPLOAD_DIR, os.W_OK)}")

# Create FastAPI app
app = FastAPI(
    title="TaskConnect API",
    description="Backend API for TaskConnect platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8080", "http://127.0.0.1:8080"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Mount static files directory
logger.debug("Mounting static files directory...")
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
logger.debug("Static files directory mounted successfully")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(services.router, prefix="/services", tags=["services"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])

@app.get("/")
async def root():
    return {"message": "Welcome to TaskConnect API"} 