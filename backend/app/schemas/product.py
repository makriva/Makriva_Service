from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class ProductImageOut(BaseModel):
    id: uuid.UUID
    url: str
    is_primary: bool

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    weight: Optional[str] = None
    stock: int = 0
    category_id: Optional[uuid.UUID] = None
    thumbnail_url: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    is_bestseller: bool = False


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    weight: Optional[str] = None
    stock: Optional[int] = None
    category_id: Optional[uuid.UUID] = None
    thumbnail_url: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_bestseller: Optional[bool] = None


class ProductOut(ProductBase):
    id: uuid.UUID
    images: List[ProductImageOut] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
