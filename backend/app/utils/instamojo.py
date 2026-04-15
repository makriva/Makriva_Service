import requests
from app.config import settings


def create_payment_request(amount: float, purpose: str, buyer_name: str, email: str, phone: str) -> dict:
    """Create a payment request on Instamojo. Returns payment URL."""
    headers = {
        "X-Api-Key": settings.INSTAMOJO_API_KEY or "",
        "X-Auth-Token": settings.INSTAMOJO_AUTH_TOKEN or "",
    }
    data = {
        "purpose": purpose,
        "amount": str(round(amount, 2)),
        "buyer_name": buyer_name,
        "email": email,
        "phone": phone,
        "redirect_url": settings.INSTAMOJO_REDIRECT_URL,
        "send_email": True,
        "send_sms": True,
        "allow_repeated_payments": False,
    }
    resp = requests.post(
        f"{settings.INSTAMOJO_BASE_URL}/payment-requests/",
        headers=headers,
        data=data,
    )
    resp.raise_for_status()
    result = resp.json()
    return {
        "payment_request_id": result["payment_request"]["id"],
        "payment_url": result["payment_request"]["longurl"],
    }


def get_payment_status(payment_request_id: str, payment_id: str) -> dict:
    """Verify payment status from Instamojo."""
    headers = {
        "X-Api-Key": settings.INSTAMOJO_API_KEY or "",
        "X-Auth-Token": settings.INSTAMOJO_AUTH_TOKEN or "",
    }
    resp = requests.get(
        f"{settings.INSTAMOJO_BASE_URL}/payment-requests/{payment_request_id}/{payment_id}/",
        headers=headers,
    )
    resp.raise_for_status()
    return resp.json()
