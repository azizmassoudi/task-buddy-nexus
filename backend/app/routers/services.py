from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Any, Optional
import os
from datetime import datetime
from pathlib import Path
import logging

from ..database import get_db
from ..models.base import Service, User
from ..schemas import ServiceCreate, Service as ServiceSchema
from ..core.auth import get_current_user
from ..core.file_upload import save_uploaded_file

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Get the absolute path to the uploads directory
BASE_DIR = Path(__file__).parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
logger.debug(f"Upload directory path: {UPLOAD_DIR}")
logger.debug(f"Upload directory exists: {UPLOAD_DIR.exists()}")
logger.debug(f"Upload directory permissions: {os.access(UPLOAD_DIR, os.W_OK)}")

@router.post("/", response_model=ServiceSchema)
async def create_service(
    title: str = Form(...),
    description: str = Form(...),
    price: int = Form(...),
    category: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    try:
        # Handle image upload if provided
        image_url = None
        if image:
            image_url = await save_uploaded_file(image)
            if not image_url:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid image file"
                )

        # Create service
        service_data = {
            "title": title,
            "description": description,
            "price": price,
            "category": category,
            "imageUrl": image_url,
            "owner_id": current_user.id
        }
        
        db_service = Service(**service_data)
        db.add(db_service)
        db.commit()
        db.refresh(db_service)
        
        return db_service
        
    except Exception as e:
        logger.error(f"Error creating service: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create service"
        )

@router.get("/", response_model=List[ServiceSchema])
def read_services(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    services = db.query(Service).filter(Service.is_active == True).offset(skip).limit(limit).all()
    return services

@router.get("/{service_id}", response_model=ServiceSchema)
def read_service(
    service_id: int,
    db: Session = Depends(get_db)
) -> Any:
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return db_service

@router.put("/{service_id}", response_model=ServiceSchema)
async def update_service(
    service_id: int,
    title: str = Form(...),
    description: str = Form(...),
    price: int = Form(...),
    category: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    try:
        db_service = db.query(Service).filter(Service.id == service_id).first()
        if db_service is None:
            raise HTTPException(status_code=404, detail="Service not found")
        
        if db_service.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this service")
        
        # Handle image upload if provided
        if image:
            image_url = await save_uploaded_file(image)
            if not image_url:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid image file"
                )
            db_service.imageUrl = image_url
        
        # Update service data
        db_service.title = title
        db_service.description = description
        db_service.price = price
        db_service.category = category
        
        db.commit()
        db.refresh(db_service)
        
        return db_service
        
    except Exception as e:
        logger.error(f"Error updating service: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update service"
        )

@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    if db_service.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this service")
    
    db_service.is_active = False
    db.commit()
    return {"message": "Service deleted successfully"} 

