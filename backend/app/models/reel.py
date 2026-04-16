import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from datetime import datetime
from app.database import Base


class InstagramReel(Base):
    __tablename__ = "instagram_reels"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    url = Column(String, nullable=False)
    video_url = Column(String, nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
