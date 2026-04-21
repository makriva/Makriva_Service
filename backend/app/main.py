from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base
from app.models import contact as _contact_models, reel as _reel_models  # noqa: F401 – registers tables
from app.routers import auth, products, categories, cart, discounts, orders, payments, upload, users, settings as settings_router, contact, reels

# Create tables on startup (for dev — use Alembic in prod)
Base.metadata.create_all(bind=engine)

# Add new columns to existing tables if they don't exist yet
with engine.connect() as _conn:
    _conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_url VARCHAR"))
    _conn.execute(text("ALTER TABLE instagram_reels ADD COLUMN IF NOT EXISTS video_url VARCHAR"))
    _conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR"))
    _conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS hsn_code VARCHAR"))
    _conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS nutrition_info TEXT"))
    _conn.execute(text("ALTER TABLE products ADD COLUMN IF NOT EXISTS additional_details TEXT"))
    _conn.execute(text("ALTER TABLE product_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0"))
    _conn.commit()

app = FastAPI(
    title="MakRiva API",
    description="Backend API for MakRiva premium makhana e-commerce platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, settings.ADMIN_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(cart.router)
app.include_router(discounts.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(upload.router)
app.include_router(users.router)
app.include_router(settings_router.router)
app.include_router(contact.router)
app.include_router(reels.router)


@app.get("/")
def root():
    return {"message": "MakRiva API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
