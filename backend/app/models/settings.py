from sqlalchemy import Column, String, Float, Integer, DateTime
from datetime import datetime
from app.database import Base

class Settings(Base):
    """System settings/configuration for admin panel"""
    __tablename__ = "settings"

    id = Column(String, primary_key=True, default="default")
    shipping_charge = Column(Float, default=50.0)  # Flat shipping charge in rupees
    free_shipping_above = Column(Float, default=499.0)  # Free shipping above this amount
    tax_percentage = Column(Float, default=0.0)  # Tax percentage
    store_name = Column(String, default="MakRiva")
    store_email = Column(String, default="support@makriva.com")
    store_phone = Column(String, default="+91 98765 43210")
    store_address = Column(String, default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "shipping_charge": self.shipping_charge,
            "free_shipping_above": self.free_shipping_above,
            "tax_percentage": self.tax_percentage,
            "store_name": self.store_name,
            "store_email": self.store_email,
            "store_phone": self.store_phone,
            "store_address": self.store_address,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
