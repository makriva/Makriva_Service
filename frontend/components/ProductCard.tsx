'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiStar, FiPlus, FiCheck } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  thumbnail_url?: string;
  weight?: string;
  is_featured?: boolean;
  is_bestseller?: boolean;
}

// Stable pseudo-random rating from product id (3.8 – 4.9)
function getRating(id: string): number {
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return parseFloat((3.8 + (n % 11) * 0.1).toFixed(1));
}

// Count star fills
function starFill(rating: number, star: number): 'full' | 'half' | 'empty' {
  if (rating >= star) return 'full';
  if (rating >= star - 0.5) return 'half';
  return 'empty';
}

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addItem, addLocal } = useCart();
  const [added, setAdded] = useState(false);

  const rating     = getRating(product.id);
  const reviewCount = ((product.id.charCodeAt(0) * 37) % 800) + 120;
  const discount   = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      addItem(product.id);
    } else {
      addLocal({
        product_id:    product.id,
        name:          product.name,
        price:         product.price,
        quantity:      1,
        thumbnail_url: product.thumbnail_url || null,
        weight:        product.weight || null,
      });
    }

    // Feedback flash
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Link href={`/products/${product.slug}`} className="product-card-new group block">
      {/* ── Image ─────────────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F8F8F8]">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-108"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">🌾</div>
        )}

        {/* Badges row */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_bestseller && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase tracking-wide bg-brand shadow-sm">
              Bestseller
            </span>
          )}
          {discount && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase tracking-wide bg-green-500 shadow-sm">
              {discount}% off
            </span>
          )}
          {product.is_featured && !product.is_bestseller && (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white uppercase tracking-wide bg-violet-500 shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Quick-add overlay (desktop hover) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </div>

      {/* ── Info ──────────────────────────────────────────── */}
      <div className="p-4">
        {product.weight && (
          <p className="text-[11px] font-semibold text-[#93959F] uppercase tracking-wider mb-1">
            {product.weight}
          </p>
        )}

        <h3 className="font-bold text-[#1C1C1C] text-sm leading-snug line-clamp-2 mb-2 group-hover:text-brand transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => {
              const fill = starFill(rating, s);
              return (
                <span key={s} className="relative inline-block text-[#FFB800]" style={{ fontSize: 12 }}>
                  {fill === 'full'  && '★'}
                  {fill === 'half'  && '⯨'}
                  {fill === 'empty' && <span className="text-[#E9E9EB]">★</span>}
                </span>
              );
            })}
          </div>
          <span className="text-[11px] font-bold text-[#1C1C1C]">{rating}</span>
          <span className="text-[11px] text-[#93959F]">({reviewCount})</span>
        </div>

        {/* Price row + Add button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-[#1C1C1C]">₹{product.price}</span>
            {product.original_price && (
              <span className="text-xs text-[#93959F] line-through">₹{product.original_price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-90 ${
              added
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-brand text-white hover:bg-brand-dark shadow-sm hover:shadow-md'
            }`}
            aria-label={added ? 'Added to cart' : 'Add to cart'}
          >
            {added ? (
              <>
                <FiCheck size={13} />
                Added!
              </>
            ) : (
              <>
                <FiPlus size={13} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
