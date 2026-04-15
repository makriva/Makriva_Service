from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid
from app.models.discount import DiscountType


class DiscountBase(BaseModel):
    code: str
    description: Optional[str] = None
    discount_type: DiscountType = DiscountType.PERCENTAGE
    value: float
    min_order_amount: float = 0
    max_uses: Optional[int] = None
    is_active: bool = True
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None


class DiscountCreate(DiscountBase):
    pass


class DiscountUpdate(BaseModel):
    description: Optional[str] = None
    value: Optional[float] = None
    min_order_amount: Optional[float] = None
    max_uses: Optional[int] = None
    is_active: Optional[bool] = None
    valid_until: Optional[datetime] = None


class DiscountOut(DiscountBase):
    id: uuid.UUID
    used_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class ApplyDiscountRequest(BaseModel):
    code: str
    order_amount: float
