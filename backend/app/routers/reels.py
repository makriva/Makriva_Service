from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.reel import InstagramReel
from app.utils.auth import require_admin

router = APIRouter(prefix="/api/reels", tags=["reels"])


class ReelIn(BaseModel):
    url: str
    video_url: Optional[str] = None
    order: int = 0
    is_active: bool = True


class ReelUpdate(BaseModel):
    url: Optional[str] = None
    video_url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


def _reel_dict(r: InstagramReel) -> dict:
    return {
        "id": r.id,
        "url": r.url,
        "video_url": r.video_url,
        "order": r.order,
        "is_active": r.is_active,
    }


# ── Public ───────────────────────────────────────────────────────────────────

@router.get("")
def list_reels(db: Session = Depends(get_db)):
    reels = db.query(InstagramReel).filter(InstagramReel.is_active == True).order_by(InstagramReel.order).all()
    return [_reel_dict(r) for r in reels]


# ── Admin ────────────────────────────────────────────────────────────────────

@router.get("/all", dependencies=[Depends(require_admin)])
def list_all_reels(db: Session = Depends(get_db)):
    reels = db.query(InstagramReel).order_by(InstagramReel.order).all()
    return [{**_reel_dict(r), "created_at": r.created_at.isoformat()} for r in reels]


@router.post("", dependencies=[Depends(require_admin)], status_code=201)
def add_reel(data: ReelIn, db: Session = Depends(get_db)):
    reel = InstagramReel(url=data.url, video_url=data.video_url, order=data.order, is_active=data.is_active)
    db.add(reel)
    db.commit()
    db.refresh(reel)
    return _reel_dict(reel)


@router.put("/{reel_id}", dependencies=[Depends(require_admin)])
def update_reel(reel_id: str, data: ReelUpdate, db: Session = Depends(get_db)):
    reel = db.query(InstagramReel).filter(InstagramReel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=404, detail="Not found")
    if data.url is not None:
        reel.url = data.url
    if data.video_url is not None:
        reel.video_url = data.video_url
    if data.order is not None:
        reel.order = data.order
    if data.is_active is not None:
        reel.is_active = data.is_active
    db.commit()
    return _reel_dict(reel)


@router.delete("/{reel_id}", dependencies=[Depends(require_admin)])
def delete_reel(reel_id: str, db: Session = Depends(get_db)):
    reel = db.query(InstagramReel).filter(InstagramReel.id == reel_id).first()
    if not reel:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(reel)
    db.commit()
    return {"message": "Deleted"}
