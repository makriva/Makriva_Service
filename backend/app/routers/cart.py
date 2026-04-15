from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import CartOut, CartItemCreate, CartItemUpdate
from app.utils.auth import require_user
from app.models.user import User
import uuid

router = APIRouter(prefix="/api/cart", tags=["cart"])


def get_or_create_cart(user: User, db: Session) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user.id).first()
    if not cart:
        cart = Cart(user_id=user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


@router.get("", response_model=CartOut)
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    return get_or_create_cart(current_user, db)


@router.post("/items", response_model=CartOut)
def add_to_cart(data: CartItemCreate, db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    cart = get_or_create_cart(current_user, db)
    existing = db.query(CartItem).filter(CartItem.cart_id == cart.id, CartItem.product_id == data.product_id).first()
    if existing:
        existing.quantity += data.quantity
    else:
        item = CartItem(cart_id=cart.id, product_id=data.product_id, quantity=data.quantity)
        db.add(item)
    db.commit()
    db.refresh(cart)
    return cart


@router.put("/items/{item_id}", response_model=CartOut)
def update_cart_item(item_id: uuid.UUID, data: CartItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    cart = get_or_create_cart(current_user, db)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if data.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = data.quantity
    db.commit()
    db.refresh(cart)
    return cart


@router.delete("/items/{item_id}", response_model=CartOut)
def remove_cart_item(item_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    cart = get_or_create_cart(current_user, db)
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    db.refresh(cart)
    return cart


@router.delete("")
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(require_user)):
    cart = get_or_create_cart(current_user, db)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
