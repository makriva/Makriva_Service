import cloudinary
import cloudinary.uploader
from app.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

# Folder structure under Cloudinary account "MAKRIVA":
#   makriva/products   → product images
#   makriva/categories → category cover images
#   makriva/banners    → hero / promotional banners
#   makriva/videos     → product or promotional videos


def upload_image(file_bytes: bytes, folder: str = "makriva/products") -> dict:
    """Upload a still image. Auto-optimises quality and format."""
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        transformation=[
            {"width": 1200, "height": 1200, "crop": "limit"},
            {"quality": "auto:good"},
            {"fetch_format": "auto"},
        ],
        resource_type="image",
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


def upload_banner(file_bytes: bytes) -> dict:
    """Upload a wide banner / hero image (16:9 crop)."""
    result = cloudinary.uploader.upload(
        file_bytes,
        folder="makriva/banners",
        transformation=[
            {"width": 1920, "height": 1080, "crop": "limit"},
            {"quality": "auto:good"},
            {"fetch_format": "auto"},
        ],
        resource_type="image",
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


def upload_category_image(file_bytes: bytes) -> dict:
    """Upload a category cover image (square)."""
    result = cloudinary.uploader.upload(
        file_bytes,
        folder="makriva/categories",
        transformation=[
            {"width": 600, "height": 600, "crop": "fill", "gravity": "auto"},
            {"quality": "auto:good"},
            {"fetch_format": "auto"},
        ],
        resource_type="image",
    )
    return {"url": result["secure_url"], "public_id": result["public_id"]}


def upload_video(file_bytes: bytes, folder: str = "makriva/videos") -> dict:
    """Upload a video. Stored as-is; Cloudinary streams it on delivery."""
    result = cloudinary.uploader.upload(
        file_bytes,
        folder=folder,
        resource_type="video",
        eager=[
            # Create an HLS stream version automatically
            {"streaming_profile": "hd", "format": "m3u8"},
        ],
        eager_async=True,
    )
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "duration": result.get("duration"),
        "format": result.get("format"),
    }


def delete_asset(public_id: str, resource_type: str = "image") -> bool:
    result = cloudinary.uploader.destroy(public_id, resource_type=resource_type)
    return result.get("result") == "ok"


# Keep old name as alias so existing callers don't break
def delete_image(public_id: str) -> bool:
    return delete_asset(public_id, resource_type="image")
