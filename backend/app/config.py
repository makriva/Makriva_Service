from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://makriva_user:makriva_pass@localhost:5432/makriva_db"
    SECRET_KEY: str = "changethis-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"

    FACEBOOK_CLIENT_ID: Optional[str] = None
    FACEBOOK_CLIENT_SECRET: Optional[str] = None
    FACEBOOK_REDIRECT_URI: str = "http://localhost:8000/api/auth/facebook/callback"

    CLOUDINARY_CLOUD_NAME: str = "dsqzdclae"
    CLOUDINARY_API_KEY: str = "837564842145463"
    CLOUDINARY_API_SECRET: str = "RA2rbVvah0rpGBOysXhfkMxKIPc"

    INSTAMOJO_API_KEY: Optional[str] = None
    INSTAMOJO_AUTH_TOKEN: Optional[str] = None
    INSTAMOJO_BASE_URL: str = "https://test.instamojo.com/api/1.1"
    INSTAMOJO_REDIRECT_URL: str = "http://localhost:3000/payment-status"

    FRONTEND_URL: str = "http://localhost:3000"
    ADMIN_URL: str = "http://localhost:3001"
    BACKEND_URL: str = "http://localhost:8000"

    # Zoho Mail SMTP
    ZOHO_SMTP_HOST: str = "smtp.zoho.in"
    ZOHO_SMTP_PORT: int = 465
    ZOHO_SENDER_EMAIL: str = "team@makriva.in"
    ZOHO_SMTP_PASSWORD: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()
