'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Props { open: boolean; onClose: () => void; }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CartDrawer({ open, onClose }: Props) {
  const { user } = useAuth();
  const { items, itemCount, total, updateItem, removeItem, localItems, updateLocal, removeLocal } = useCart();
  const [freeAbove, setFreeAbove] = useState(499);
  const [shipCharge, setShipCharge] = useState(50);

  useEffect(() => {
    fetch(`${API}/api/settings/public`)
      .then(r => r.json())
      .then(d => { setFreeAbove(d.free_shipping_above ?? 499); setShipCharge(d.shipping_charge ?? 50); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const displayItems = user
    ? items.map(i => ({
        id:       i.id,
        name:     i.product.name,
        price:    i.product.price,
        quantity: i.quantity,
        image:    i.product.thumbnail_url,
        weight:   i.product.weight,
      }))
    : localItems.map(i => ({
        id:       i.product_id,
        name:     i.name,
        price:    i.price,
        quantity: i.quantity,
        image:    i.thumbnail_url,
        weight:   i.weight,
      }));

  const shipping   = total >= freeAbove ? 0 : shipCharge;
  const finalTotal = total + shipping;

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* ── Drawer ───────────────────────────────────────── */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-350 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0]">
          <div className="flex items-center gap-3">
            <FiShoppingBag size={20} className="text-brand" />
            <h2 className="font-extrabold text-[#1C1C1C] text-lg">
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white bg-brand">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#686B78] hover:bg-[#F8F8F8] hover:text-[#1C1C1C] transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Free shipping progress bar */}
        {total < freeAbove && displayItems.length > 0 && (
          <div className="px-6 pt-4 pb-3 bg-brand-50 border-b border-[#FFE4D6]">
            <div className="flex justify-between text-xs font-semibold text-[#686B78] mb-1.5">
              <span>Add ₹{(freeAbove - total).toFixed(0)} more for</span>
              <span className="text-brand font-bold">Free Delivery</span>
            </div>
            <div className="h-1.5 bg-[#FFE4D6] rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all duration-500"
                style={{ width: `${Math.min((total / freeAbove) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {total >= freeAbove && displayItems.length > 0 && (
          <div className="px-6 py-2.5 bg-green-50 border-b border-green-100">
            <p className="text-xs font-bold text-green-600">🎉 You unlocked free delivery!</p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-brand-50 flex items-center justify-center text-3xl">🛒</div>
              <div>
                <h3 className="font-bold text-[#1C1C1C] mb-1">Your cart is empty</h3>
                <p className="text-sm text-[#686B78]">Browse our crunchy makhana range</p>
              </div>
              <Link href="/products" onClick={onClose} className="btn-gold px-8 mt-2">
                Order Now
              </Link>
            </div>
          ) : (
            <div className="px-6 py-4 space-y-1">
              {displayItems.map(item => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-[#F5F5F5] last:border-0">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F8F8F8] flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🌾</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#1C1C1C] truncate">{item.name}</p>
                    {item.weight && (
                      <p className="text-xs text-[#93959F] mt-0.5">{item.weight}</p>
                    )}
                    <p className="text-brand font-extrabold mt-1 text-sm">₹{item.price}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex items-center border border-[#E9E9EB] rounded-xl overflow-hidden">
                        <button
                          onClick={() =>
                            user
                              ? updateItem(item.id, item.quantity - 1)
                              : updateLocal(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#686B78] hover:bg-brand hover:text-white transition-colors"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#1C1C1C]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            user
                              ? updateItem(item.id, item.quantity + 1)
                              : updateLocal(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-[#686B78] hover:bg-brand hover:text-white transition-colors"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          user ? removeItem(item.id) : removeLocal(item.id)
                        }
                        className="ml-auto text-[#93959F] hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {displayItems.length > 0 && (
          <div className="px-6 py-5 border-t border-[#F0F0F0] bg-white space-y-4">
            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#686B78]">
                <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                <span className="font-semibold text-[#1C1C1C]">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#686B78]">
                <span>Delivery</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-[#1C1C1C]'}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-[#1C1C1C] text-base border-t border-[#F0F0F0] pt-2">
                <span>Total</span>
                <span className="text-brand">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base"
            >
              Proceed to Checkout <FiArrowRight size={16} />
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center text-sm font-semibold text-[#686B78] hover:text-brand transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
