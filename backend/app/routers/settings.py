from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.settings import Settings
from app.schemas.settings import SettingsResponse, SettingsUpdate, SettingsPublic
from app.utils.auth import get_current_user, require_admin

router = APIRouter(prefix="/api/settings", tags=["Settings"])

# Get or create default settings
def get_or_create_settings(db: Session) -> Settings:
    """Get default settings or create if not exists"""
    settings = db.query(Settings).filter(Settings.id == "default").first()
    if not settings:
        settings = Settings(id="default")
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

@router.get("/public", response_model=SettingsPublic)
async def get_public_settings(db: Session = Depends(get_db)):
    """Get public settings (accessible to everyone)"""
    settings = get_or_create_settings(db)
    return settings

@router.get("/", response_model=SettingsResponse)
async def get_settings(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get all settings (admin only)"""
    settings = get_or_create_settings(db)
    return settings

@router.put("/", response_model=SettingsResponse)
async def update_settings(
    data: SettingsUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Update settings (admin only)"""
    settings = get_or_create_settings(db)
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(settings, field, value)
    
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings
