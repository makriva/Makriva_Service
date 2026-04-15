'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
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

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addItem, addLocal } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      addItem(product.id);
    } else {
      addLocal({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        thumbnail_url: product.thumbnail_url || null,
        weight: product.weight || null,
      });
    }
  };

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="product-card-new group block overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">🌾</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_bestseller && <span className="badge-gold">Bestseller</span>}
          {product.is_featured && <span className="badge-gold bg-[#E90064] text-white" style={{ background: '#E90064' }}>Featured</span>}
          {discount && <span className="badge-gold bg-green-600 text-white" style={{ background: '#16a34a' }}>-{discount}%</span>}
        </div>

        {/* Quick add button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-black"
          style={{ background: 'linear-gradient(135deg,#D4AF37,#F0D060)' }}
        >
          <FiShoppingCart size={17} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.weight}</p>
        <h3 className="font-semibold text-sm text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-[#D4AF37] font-bold">₹{product.price}</span>
          {product.original_price && (
            <span className="text-gray-500 text-sm line-through">₹{product.original_price}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          {[1,2,3,4,5].map(s => (
            <FiStar key={s} size={10} className="text-[#D4AF37] fill-current" />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.8)</span>
        </div>
      </div>
    </Link>
  );
}
