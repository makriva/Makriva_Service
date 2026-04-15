from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SettingsUpdate(BaseModel):
    """Request model for updating settings"""
    shipping_charge: Optional[float] = None
    free_shipping_above: Optional[float] = None
    tax_percentage: Optional[float] = None
    store_name: Optional[str] = None
    store_email: Optional[str] = None
    store_phone: Optional[str] = None
    store_address: Optional[str] = None

    class Config:
        from_attributes = True

class SettingsResponse(BaseModel):
    """Response model for settings"""
    id: str
    shipping_charge: float
    free_shipping_above: float
    tax_percentage: float
    store_name: str
    store_email: str
    store_phone: str
    store_address: str
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SettingsPublic(BaseModel):
    """Public settings (no sensitive data)"""
    shipping_charge: float
    free_shipping_above: float
    tax_percentage: float
    store_name: str
    store_phone: str

    class Config:
        from_attributes = True
