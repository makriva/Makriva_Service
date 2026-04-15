from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.discount import Discount
from app.schemas.discount import DiscountCreate, DiscountUpdate, DiscountOut, ApplyDiscountRequest
from app.utils.auth import require_admin
import uuid

router = APIRouter(prefix="/api/discounts", tags=["discounts"])


@router.get("", response_model=List[DiscountOut])
def list_discounts(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(Discount).all()


@router.post("", response_model=DiscountOut)
def create_discount(data: DiscountCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    if db.query(Discount).filter(Discount.code == data.code.upper()).first():
        raise HTTPException(status_code=400, detail="Discount code already exists")
    discount = Discount(**{**data.model_dump(), "code": data.code.upper()})
    db.add(discount)
    db.commit()
    db.refresh(discount)
    return discount


@router.put("/{discount_id}", response_model=DiscountOut)
def update_discount(discount_id: uuid.UUID, data: DiscountUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(discount, key, value)
    db.commit()
    db.refresh(discount)
    return discount


@router.delete("/{discount_id}")
def delete_discount(discount_id: uuid.UUID, db: Session = Depends(get_db), _=Depends(require_admin)):
    discount = db.query(Discount).filter(Discount.id == discount_id).first()
    if not discount:
        raise HTTPException(status_code=404, detail="Discount not found")
    db.delete(discount)
    db.commit()
    return {"message": "Discount deleted"}


@router.post("/apply")
def apply_discount(data: ApplyDiscountRequest, db: Session = Depends(get_db)):
    discount = db.query(Discount).filter(
        Discount.code == data.code.upper(),
        Discount.is_active == True,
    ).first()

    if not discount:
        raise HTTPException(status_code=404, detail="Invalid discount code")

    now = datetime.utcnow()
    if discount.valid_until and discount.valid_until < now:
        raise HTTPException(status_code=400, detail="Discount code has expired")
    if discount.valid_from and discount.valid_from > now:
        raise HTTPException(status_code=400, detail="Discount code is not yet active")
    if discount.max_uses and discount.used_count >= discount.max_uses:
        raise HTTPException(status_code=400, detail="Discount code usage limit reached")
    if data.order_amount < discount.min_order_amount:
        raise HTTPException(status_code=400, detail=f"Minimum order amount is ₹{discount.min_order_amount}")

    if discount.discount_type == "percentage":
        discount_amount = round(data.order_amount * discount.value / 100, 2)
    else:
        discount_amount = min(discount.value, data.order_amount)

    return {
        "code": discount.code,
        "discount_type": discount.discount_type,
        "value": discount.value,
        "discount_amount": discount_amount,
        "final_amount": round(data.order_amount - discount_amount, 2),
    }
