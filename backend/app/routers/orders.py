from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.discount import Discount
from app.models.settings import Settings
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.utils.auth import require_user, require_admin, get_current_user
from app.models.user import User
import uuid
import random
import string
from datetime import datetime

router = APIRouter(prefix="/api/orders", tags=["orders"])


def generate_order_number() -> str:
    chars = string.ascii_uppercase + string.digits
    return "MKR-" + "".join(random.choices(chars, k=8))


@router.post("", response_model=OrderOut)
def create_order(data: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    """Create an order — requires a logged-in user."""
    subtotal = 0.0
    items_data = []
    for item in data.items:
        product = db.query(Product).filter(Product.id == item.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
        line_total = product.price * item.quantity
        subtotal += line_total
        items_data.append((product, item.quantity, line_total))

    # Apply discount
    discount_amount = 0.0
    if data.discount_code:
        discount = db.query(Discount).filter(
            Discount.code == data.discount_code.upper(),
            Discount.is_active == True,
        ).first()
        if discount:
            now = datetime.utcnow()
            if (not discount.valid_until or discount.valid_until >= now) and \
               (not discount.valid_from or discount.valid_from <= now) and \
               (not discount.max_uses or discount.used_count < discount.max_uses) and \
               subtotal >= discount.min_order_amount:
                if discount.discount_type == "percentage":
                    discount_amount = round(subtotal * discount.value / 100, 2)
                else:
                    discount_amount = min(discount.value, subtotal)
                discount.used_count += 1

    # Get settings for dynamic shipping charge
    settings = db.query(Settings).filter(Settings.id == "default").first()
    if not settings:
        settings = Settings(id="default")
        db.add(settings)
        db.flush()

    shipping_charge = 0.0 if subtotal >= settings.free_shipping_above else settings.shipping_charge
    total = subtotal - discount_amount + shipping_charge

    order = Order(
        order_number=generate_order_number(),
        user_id=current_user.id,
        shipping_name=data.shipping_name,
        shipping_email=data.shipping_email,
        shipping_phone=data.shipping_phone,
        shipping_address=data.shipping_address,
        shipping_city=data.shipping_city,
        shipping_state=data.shipping_state,
        shipping_pincode=data.shipping_pincode,
        subtotal=subtotal,
        discount_amount=discount_amount,
        shipping_charge=shipping_charge,
        total=total,
        discount_code=data.discount_code.upper() if data.discount_code else None,
        notes=data.notes,
    )
    db.add(order)
    db.flush()

    for product, qty, line_total in items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            product_image=product.thumbnail_url,
            price=product.price,
            quantity=qty,
            subtotal=line_total,
        )
        db.add(order_item)
        product.stock -= qty

    db.commit()
    db.refresh(order)
    return order


@router.get("/my", response_model=List[OrderOut])
def my_orders(db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    return db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()


@router.get("/number/{order_number}", response_model=OrderOut)
def get_order_by_number(order_number: str, db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return order


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return order


# ─── Admin routes ──────────────────────────────────────────────────────────────

@router.get("", response_model=List[OrderOut])
def list_orders(
    status: Optional[OrderStatus] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    q = db.query(Order)
    if status:
        q = q.filter(Order.status == status)
    if search:
        term = f"%{search}%"
        q = q.filter(
            Order.order_number.ilike(term) |
            Order.shipping_name.ilike(term) |
            Order.shipping_email.ilike(term) |
            Order.shipping_phone.ilike(term)
        )
    return q.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()


@router.put("/{order_id}/status", response_model=OrderOut)
def update_order_status(order_id: uuid.UUID, data: OrderStatusUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if data.status:
        order.status = data.status
    if data.payment_status:
        order.payment_status = data.payment_status
    if data.tracking_number is not None:
        order.tracking_number = data.tracking_number
    if data.tracking_url is not None:
        order.tracking_url = data.tracking_url
    if data.notes:
        order.notes = data.notes
    db.commit()
    db.refresh(order)
    return order
