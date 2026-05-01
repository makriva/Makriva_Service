from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.contact import ContactQuery, NewsletterSignup
from app.utils.auth import require_admin
from app.utils.email_service import send_contact_reply_email, send_bulk_email

router = APIRouter(prefix="/api/contact", tags=["contact"])


class ContactIn(BaseModel):
    name: str
    email: str
    subject: str = ""
    message: str


class ContactOut(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    is_viewed: bool
    created_at: str

    class Config:
        from_attributes = True


class NewsletterIn(BaseModel):
    email: str


class NewsletterOut(BaseModel):
    id: str
    email: str
    is_viewed: bool
    created_at: str

    class Config:
        from_attributes = True


# ── Public ──────────────────────────────────────────────────────────────────

@router.post("", status_code=201)
def submit_contact(data: ContactIn, db: Session = Depends(get_db)):
    query = ContactQuery(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message,
    )
    db.add(query)
    db.commit()
    return {"message": "Query received"}


@router.post("/newsletter", status_code=201)
def newsletter_subscribe(data: NewsletterIn, db: Session = Depends(get_db)):
    existing = db.query(NewsletterSignup).filter(NewsletterSignup.email == data.email).first()
    if existing:
        return {"message": "Already subscribed"}
    signup = NewsletterSignup(email=data.email)
    db.add(signup)
    db.commit()
    return {"message": "Subscribed successfully"}


# ── Admin ────────────────────────────────────────────────────────────────────

@router.get("/queries", dependencies=[Depends(require_admin)])
def list_queries(db: Session = Depends(get_db)):
    queries = db.query(ContactQuery).order_by(ContactQuery.created_at.desc()).all()
    return [
        {
            "id": q.id,
            "name": q.name,
            "email": q.email,
            "subject": q.subject,
            "message": q.message,
            "is_viewed": q.is_viewed,
            "created_at": q.created_at.isoformat(),
        }
        for q in queries
    ]


@router.put("/queries/{query_id}/viewed", dependencies=[Depends(require_admin)])
def mark_query_viewed(query_id: str, db: Session = Depends(get_db)):
    q = db.query(ContactQuery).filter(ContactQuery.id == query_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Not found")
    q.is_viewed = True
    db.commit()
    return {"message": "Marked as viewed"}


@router.get("/newsletter/list", dependencies=[Depends(require_admin)])
def list_newsletter(db: Session = Depends(get_db)):
    signups = db.query(NewsletterSignup).order_by(NewsletterSignup.created_at.desc()).all()
    return [
        {
            "id": s.id,
            "email": s.email,
            "is_viewed": s.is_viewed,
            "created_at": s.created_at.isoformat(),
        }
        for s in signups
    ]


@router.put("/newsletter/{signup_id}/viewed", dependencies=[Depends(require_admin)])
def mark_newsletter_viewed(signup_id: str, db: Session = Depends(get_db)):
    s = db.query(NewsletterSignup).filter(NewsletterSignup.id == signup_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    s.is_viewed = True
    db.commit()
    return {"message": "Marked as viewed"}


class ReplyIn(BaseModel):
    reply: str


class BulkEmailIn(BaseModel):
    email_ids: List[str]
    subject: str
    body: str


class GeneralEmailIn(BaseModel):
    to_email: str
    subject: str
    body: str


@router.post("/queries/{query_id}/reply", dependencies=[Depends(require_admin)])
def reply_to_query(query_id: str, data: ReplyIn, db: Session = Depends(get_db)):
    q = db.query(ContactQuery).filter(ContactQuery.id == query_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Not found")
    ok = send_contact_reply_email(q.email, q.name, q.subject or "Your Query", data.reply)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to send email")
    q.is_viewed = True
    db.commit()
    return {"message": "Reply sent"}


@router.post("/newsletter/bulk-email", dependencies=[Depends(require_admin)])
def bulk_newsletter_email(data: BulkEmailIn, db: Session = Depends(get_db)):
    signups = db.query(NewsletterSignup).filter(NewsletterSignup.id.in_(data.email_ids)).all()
    emails = [s.email for s in signups]
    if not emails:
        raise HTTPException(status_code=400, detail="No valid recipients")
    result = send_bulk_email(emails, data.subject, data.body)
    return result


@router.post("/send-email", dependencies=[Depends(require_admin)])
def send_general_email(data: GeneralEmailIn):
    ok = send_bulk_email([data.to_email], data.subject, data.body)
    if ok["sent"] == 0:
        raise HTTPException(status_code=500, detail="Failed to send email")
    return {"message": "Email sent"}
