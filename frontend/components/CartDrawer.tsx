'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiX, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Props { open: boolean; onClose: () => void; }

export default function CartDrawer({ open, onClose }: Props) {
  const { user } = useAuth();
  const { items, itemCount, total, updateItem, removeItem, localItems, updateLocal, removeLocal } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const displayItems = user
    ? items.map(i => ({
        id: i.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.thumbnail_url,
        weight: i.product.weight,
      }))
    : localItems.map(i => ({
        id: i.product_id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.thumbnail_url,
        weight: i.weight,
      }));

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      {/* Drawer */}
      <aside className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#0D0D0D] border-l border-[#1E1E1E] z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E1E1E]">
          <h2 className="font-bold text-lg tracking-wider uppercase">Cart <span className="text-[#D4AF37]">({itemCount})</span></h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><FiX size={22} /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {displayItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-6">Your cart is empty</p>
              <Link href="/products" onClick={onClose} className="btn-gold">Shop Now</Link>
            </div>
          ) : (
            displayItems.map(item => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-[#1a1a1a]">
                <div className="w-20 h-20 bg-[#1a1a1a] flex-shrink-0 overflow-hidden">
                  {item.image
                    ? <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No img</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  {item.weight && <p className="text-xs text-gray-500 mt-0.5">{item.weight}</p>}
                  <p className="text-[#D4AF37] font-bold mt-1">₹{item.price}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => user ? updateItem(item.id, item.quantity - 1) : updateLocal(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center border border-[#333] hover:border-[#D4AF37] text-gray-400 hover:text-[#D4AF37] transition-colors">
                      <FiMinus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => user ? updateItem(item.id, item.quantity + 1) : updateLocal(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center border border-[#333] hover:border-[#D4AF37] text-gray-400 hover:text-[#D4AF37] transition-colors">
                      <FiPlus size={12} />
                    </button>
                    <button onClick={() => user ? removeItem(item.id) : removeLocal(item.id)}
                      className="ml-auto text-gray-500 hover:text-red-400 transition-colors">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {displayItems.length > 0 && (
          <div className="px-6 py-6 border-t border-[#1E1E1E] space-y-3">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Subtotal</span><span className="text-white font-semibold">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Shipping</span><span className="text-green-400">{total >= 499 ? 'FREE' : '₹50'}</span>
            </div>
            <Link href="/checkout" onClick={onClose} className="btn-gold w-full block text-center mt-4">
              Proceed to Checkout
            </Link>
            <Link href="/cart" onClick={onClose} className="btn-outline-gold w-full block text-center">
              View Cart
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
