from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal
from datetime import datetime
from .models.base import UserRole

# Define the role type to match the enum values
UserRoleType = Literal['admin', 'subcontractor', 'client']

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.client  # Default role is client

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ServiceBase(BaseModel):
    title: str
    description: str
    price: int
    category: str
    imageUrl: str | None = None

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    owner_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    description: str
    service_id: int

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    client_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    content: str
    job_id: int

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    sender_id: int
    created_at: datetime

    class Config:
        from_attributes = True 