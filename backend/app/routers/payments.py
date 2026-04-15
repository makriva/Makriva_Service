from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.order import Order, PaymentStatus
from app.utils.instamojo import create_payment_request, get_payment_status
from app.utils.auth import require_user
from app.models.user import User
import uuid

router = APIRouter(prefix="/api/payments", tags=["payments"])


@router.post("/initiate/{order_id}")
def initiate_payment(order_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id and order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")

    try:
        result = create_payment_request(
            amount=order.total,
            purpose=f"MakRiva Order {order.order_number}",
            buyer_name=order.shipping_name,
            email=order.shipping_email,
            phone=order.shipping_phone,
        )
        order.payment_request_id = result["payment_request_id"]
        db.commit()
        return {"payment_url": result["payment_url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment initiation failed: {str(e)}")


@router.get("/verify")
def verify_payment(
    payment_request_id: str,
    payment_id: str,
    payment_status: str,
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.payment_request_id == payment_request_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if payment_status.lower() == "credit":
        order.payment_status = PaymentStatus.PAID
        order.payment_id = payment_id
        from app.models.order import OrderStatus
        order.status = OrderStatus.CONFIRMED
    else:
        order.payment_status = PaymentStatus.FAILED

    db.commit()
    return {"order_id": str(order.id), "payment_status": order.payment_status}
