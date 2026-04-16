import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text
from datetime import datetime
from app.database import Base


class ContactQuery(Base):
    __tablename__ = "contact_queries"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, default="")
    message = Column(Text, nullable=False)
    is_viewed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class NewsletterSignup(Base):
    __tablename__ = "newsletter_signups"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, nullable=False)
    is_viewed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
