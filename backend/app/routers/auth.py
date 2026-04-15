from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.order import Order
from app.schemas.user import UserCreate, UserOut, Token, LoginRequest
from app.utils.auth import hash_password, verify_password, create_access_token, require_user
from app.config import settings
import httpx

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token)
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=data.email,
        full_name=data.full_name,
        phone=data.phone,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Link any guest orders with this email to the new user account
    guest_orders = db.query(Order).filter(
        Order.shipping_email == data.email,
        Order.user_id == None  # Only guest orders
    ).all()
    for order in guest_orders:
        order.user_id = user.id
    if guest_orders:
        db.commit()
    
    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not user.hashed_password or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(require_user)):
    return current_user


# --- Google OAuth ---
@router.get("/google")
def google_login():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")
    params = (
        f"client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.GOOGLE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=openid+email+profile"
    )
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")
    async with httpx.AsyncClient() as client:
        token_resp = await client.post("https://oauth2.googleapis.com/token", data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        })
        token_data = token_resp.json()
        user_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {token_data['access_token']}"},
        )
        user_info = user_resp.json()

    user = db.query(User).filter(User.email == user_info["email"]).first()
    if not user:
        user = User(
            email=user_info["email"],
            full_name=user_info.get("name"),
            avatar_url=user_info.get("picture"),
            oauth_provider="google",
            oauth_id=user_info["id"],
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Link any guest orders with this email to the new user account
        guest_orders = db.query(Order).filter(
            Order.shipping_email == user_info["email"],
            Order.user_id == None  # Only guest orders
        ).all()
        for order in guest_orders:
            order.user_id = user.id
        if guest_orders:
            db.commit()

    token = create_access_token({"sub": str(user.id)})
    return RedirectResponse(f"{settings.FRONTEND_URL}/login?token={token}")


# --- Facebook OAuth ---
@router.get("/facebook")
def facebook_login():
    if not settings.FACEBOOK_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Facebook OAuth not configured")
    params = (
        f"client_id={settings.FACEBOOK_CLIENT_ID}"
        f"&redirect_uri={settings.FACEBOOK_REDIRECT_URI}"
        f"&scope=email,public_profile"
    )
    return RedirectResponse(f"https://www.facebook.com/v17.0/dialog/oauth?{params}")


@router.get("/facebook/callback")
async def facebook_callback(code: str, db: Session = Depends(get_db)):
    if not settings.FACEBOOK_CLIENT_ID or not settings.FACEBOOK_CLIENT_SECRET:
        raise HTTPException(status_code=501, detail="Facebook OAuth not configured")
    async with httpx.AsyncClient() as client:
        token_resp = await client.get(
            "https://graph.facebook.com/v17.0/oauth/access_token",
            params={
                "client_id": settings.FACEBOOK_CLIENT_ID,
                "client_secret": settings.FACEBOOK_CLIENT_SECRET,
                "redirect_uri": settings.FACEBOOK_REDIRECT_URI,
                "code": code,
            },
        )
        access_token = token_resp.json()["access_token"]
        user_resp = await client.get(
            "https://graph.facebook.com/me",
            params={"fields": "id,name,email,picture", "access_token": access_token},
        )
        user_info = user_resp.json()

    if "email" not in user_info:
        raise HTTPException(status_code=400, detail="Email not available from Facebook")

    user = db.query(User).filter(User.email == user_info["email"]).first()
    if not user:
        user = User(
            email=user_info["email"],
            full_name=user_info.get("name"),
            avatar_url=user_info.get("picture", {}).get("data", {}).get("url"),
            oauth_provider="facebook",
            oauth_id=user_info["id"],
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Link any guest orders with this email to the new user account
        guest_orders = db.query(Order).filter(
            Order.shipping_email == user_info["email"],
            Order.user_id == None  # Only guest orders
        ).all()
        for order in guest_orders:
            order.user_id = user.id
        if guest_orders:
            db.commit()

    token = create_access_token({"sub": str(user.id)})
    return RedirectResponse(f"{settings.FRONTEND_URL}/login?token={token}")
