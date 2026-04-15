from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Product, ProductImage
from app.models.category import Category
from app.utils.cloudinary_helper import (
    upload_image,
    upload_banner,
    upload_category_image,
    upload_video,
    delete_asset,
    delete_image,
)
from app.utils.auth import require_admin
import uuid

router = APIRouter(prefix="/api/upload", tags=["upload"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"}
MAX_IMAGE_SIZE = 10 * 1024 * 1024   # 10 MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100 MB


# ─── Product images ───────────────────────────────────────────────────────────

@router.post("/product/{product_id}")
async def upload_product_image(
    product_id: uuid.UUID,
    file: UploadFile = File(...),
    is_primary: bool = False,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, or GIF images are allowed")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10 MB limit")

    result = upload_image(contents, folder="makriva/products")

    if is_primary:
        db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_primary": False})
        product.thumbnail_url = result["url"]

    image = ProductImage(
        product_id=product_id,
        url=result["url"],
        public_id=result["public_id"],
        is_primary=is_primary,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return {"url": image.url, "public_id": image.public_id, "id": str(image.id)}


@router.delete("/product-image/{image_id}")
def delete_product_image(
    image_id: uuid.UUID,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    image = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    if image.public_id:
        delete_image(image.public_id)
    db.delete(image)
    db.commit()
    return {"message": "Image deleted"}


# ─── Category images ──────────────────────────────────────────────────────────

@router.post("/category/{category_id}")
async def upload_category_cover(
    category_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, or GIF images are allowed")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10 MB limit")

    result = upload_category_image(contents)
    category.image_url = result["url"]
    db.commit()
    return {"url": result["url"], "public_id": result["public_id"]}


# ─── Banner / hero images ─────────────────────────────────────────────────────

@router.post("/banner")
async def upload_banner_image(
    file: UploadFile = File(...),
    _=Depends(require_admin),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, or GIF images are allowed")

    contents = await file.read()
    if len(contents) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10 MB limit")

    result = upload_banner(contents)
    return {"url": result["url"], "public_id": result["public_id"]}


@router.delete("/banner")
def delete_banner_image(public_id: str, _=Depends(require_admin)):
    deleted = delete_asset(public_id, resource_type="image")
    if not deleted:
        raise HTTPException(status_code=400, detail="Could not delete banner")
    return {"message": "Banner deleted"}


# ─── Videos ───────────────────────────────────────────────────────────────────

@router.post("/video")
async def upload_product_video(
    file: UploadFile = File(...),
    _=Depends(require_admin),
):
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(status_code=400, detail="Only MP4, WebM, MOV, or AVI videos are allowed")

    contents = await file.read()
    if len(contents) > MAX_VIDEO_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 100 MB limit")

    result = upload_video(contents, folder="makriva/videos")
    return {
        "url": result["url"],
        "public_id": result["public_id"],
        "duration": result.get("duration"),
        "format": result.get("format"),
    }


@router.delete("/video")
def delete_video_asset(public_id: str, _=Depends(require_admin)):
    deleted = delete_asset(public_id, resource_type="video")
    if not deleted:
        raise HTTPException(status_code=400, detail="Could not delete video")
    return {"message": "Video deleted"}
