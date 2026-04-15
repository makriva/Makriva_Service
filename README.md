# MakRiva Platform v2

Premium Makhana e-commerce platform with separate customer frontend, admin portal, and FastAPI backend.

## Structure

```
makriva-v2/
├── backend/        FastAPI + PostgreSQL
├── frontend/       Next.js 14 - Customer store (port 3000)
├── admin/          Next.js 14 - Admin portal (port 3001)
└── docker-compose.yml
```

## Quick Start (Docker)

```bash
# 1. Copy env file
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# 2. Start everything
docker-compose up --build

# Services:
# Frontend:  http://localhost:3000
# Admin:     http://localhost:3001
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
```

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # fill in your values
uvicorn app.main:app --reload --port 8000
```

### Customer Frontend
```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
```

### Admin Portal
```bash
cd admin
npm install
npm run dev    # http://localhost:3001
```

## First Admin User
After starting the backend, register a user at `/api/auth/register`, then set `is_admin = true` directly in the database:
```sql
UPDATE users SET is_admin = true WHERE email = 'your@email.com';
```

## Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT secret key (change in production!) |
| `CLOUDINARY_CLOUD_NAME` | dsqzdclae |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `INSTAMOJO_API_KEY` | Instamojo API key |
| `INSTAMOJO_AUTH_TOKEN` | Instamojo auth token |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FACEBOOK_CLIENT_ID` | Facebook app ID |
| `FACEBOOK_CLIENT_SECRET` | Facebook app secret |

## Features

### Customer Store
- Hero slider with product showcase
- Product listing with search & sort
- Product detail page
- Cart (works without login)
- Checkout with Instamojo payment
- Login/Signup (email + Google + Facebook OAuth)
- Profile & order history
- Discount code support
- Free shipping above ₹499

### Admin Portal
- Dashboard with revenue charts
- Products: add, edit, delete, upload images (Cloudinary)
- Orders: view, update status, add tracking number
- Discount codes: create, manage, copy codes
- Users: view, activate/deactivate
- Categories: create and manage

### Backend API
- FastAPI with auto-generated docs at `/docs`
- PostgreSQL with SQLAlchemy ORM
- Alembic migrations
- JWT authentication
- Cloudinary image uploads
- Instamojo payment integration
