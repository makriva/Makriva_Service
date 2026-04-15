from pydantic import BaseModel
from typing import List, Optional
import uuid
from app.schemas.product import ProductOut


class CartItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    product: ProductOut

    class Config:
        from_attributes = True


class CartOut(BaseModel):
    id: uuid.UUID
    items: List[CartItemOut] = []

    class Config:
        from_attributes = True
