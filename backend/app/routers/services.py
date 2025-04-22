from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from ..database import get_db
from ..models.base import Service, User
from ..schemas import ServiceCreate, Service as ServiceSchema
from ..core.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=ServiceSchema)
def create_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_user = db.query(User).filter(User.username == current_user).first()
    db_service = Service(
        **service.dict(),
        owner_id=db_user.id
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@router.get("/", response_model=List[ServiceSchema])
def read_services(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> Any:
    services = db.query(Service).offset(skip).limit(limit).all()
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
def update_service(
    service_id: int,
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db_user = db.query(User).filter(User.username == current_user).first()
    if db_service.owner_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this service")
    
    for key, value in service.dict().items():
        setattr(db_service, key, value)
    
    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/{service_id}")
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> Any:
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if db_service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db_user = db.query(User).filter(User.username == current_user).first()
    if db_service.owner_id != db_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this service")
    
    db.delete(db_service)
    db.commit()
    return {"message": "Service deleted successfully"} 