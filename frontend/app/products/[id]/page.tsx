'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProduct } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { FiMinus, FiPlus, FiShoppingCart, FiStar, FiArrowLeft } from 'react-icons/fi';

const FALLBACK_PRODUCTS: Record<string, any> = {
  'dry-roasted-makhana': { id: '1', name: 'Premium Dry Roasted Makhana', slug: 'dry-roasted-makhana', price: 299, original_price: 499, thumbnail_url: '/images/makriva-dry-roasted.jpg', weight: '150g', is_bestseller: true, description: 'Our signature dry roasted makhana is slow-roasted to perfection — crispy, light, and absolutely delicious. Made from the finest Large Grade foxnuts, this variant has zero oil, zero preservatives, and maximum nutrition.\n\nHigh in protein and fiber, low in calories — the perfect snack for fitness enthusiasts and health-conscious individuals alike.', short_description: 'Crispy, light & delicious. Zero oil, zero preservatives.' },
  'large-grade': { id: '2', name: 'Phool Makhana — Large Grade', slug: 'large-grade', price: 399, original_price: 650, thumbnail_url: '/images/makriva-large-grade.jpg', weight: '250g', is_featured: true, description: 'Our Large Grade Phool Makhana represents the pinnacle of makhana quality. Carefully handpicked, only the largest and most uniform lotus seeds make it into this premium pack.\n\nPerfect for cooking, roasting at home, or gifting to loved ones.', short_description: 'Largest grade foxnuts. Premium quality, handpicked.' },
  'medium-grade': { id: '3', name: 'Phool Makhana — Medium Grade', slug: 'medium-grade', price: 299, original_price: 549, thumbnail_url: '/images/makriva-medium-grade.jpg', weight: '250g', description: 'Our Medium Grade makhana offers excellent value without compromising on quality. Perfect for everyday snacking and cooking.', short_description: 'Perfect everyday makhana. Great value, excellent quality.' },
  'rock-salt-pepper': { id: '4', name: 'Rock Salt & Pepper', slug: 'rock-salt-pepper', price: 249, original_price: 399, thumbnail_url: '/images/rock-salt-pepper.png', weight: '100g', description: 'A timeless classic — our Large Grade makhana seasoned with Himalayan rock salt and freshly ground black pepper. Simple, clean flavours that let the makhana shine.', short_description: 'Classic Himalayan rock salt & black pepper seasoning.' },
  'pudina-fresh': { id: '5', name: 'Pudina Fresh', slug: 'pudina-fresh', price: 249, original_price: 399, thumbnail_url: '/images/pudina-fresh.png', weight: '100g', description: 'Refreshing mint (pudina) seasoning on our premium makhana. A cool, refreshing flavour that makes for the perfect summer snack.', short_description: 'Refreshing mint flavour on premium makhana.' },
  'chilli-cheese': { id: '6', name: 'Chilli Cheese', slug: 'chilli-cheese', price: 249, original_price: 399, thumbnail_url: '/images/chilly-cheese.png', weight: '100g', description: 'Bold and spicy chilli with rich cheese seasoning on our premium makhana. For those who love their snacks with a kick!', short_description: 'Spicy chilli + rich cheese. Bold & addictive.' },
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addItem, addLocal } = useCart();

  useEffect(() => {
    setLoading(true);
    getProduct(id as string)
      .then(setProduct)
      .catch(() => setProduct(FALLBACK_PRODUCTS[id as string] || null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (user) {
      addItem(product.id, qty);
    } else {
      // Add single entry to cart with full quantity (not loop)
      addLocal({ product_id: product.id, name: product.name, price: product.price, quantity: qty, thumbnail_url: product.thumbnail_url || null, weight: product.weight || null });
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
      <Footer />
    </>
  );

  if (!product) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <h1 className="text-2xl text-gray-400">Product not found</h1>
        <Link href="/products" className="btn-gold">Back to Shop</Link>
      </div>
      <Footer />
    </>
  );

  const images = product.images?.length
    ? product.images.map((i: any) => i.url)
    : [product.thumbnail_url || '/images/makriva-dry-roasted.jpg'];

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-[#D4AF37]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#D4AF37]">Shop</Link>
            <span>/</span>
            <span className="text-gray-300">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-[#111] overflow-hidden">
                <Image src={images[activeImage]} alt={product.name} fill className="object-cover" />
                {discount && <span className="absolute top-4 left-4 badge-gold bg-green-600 text-white" style={{ background: '#16a34a' }}>-{discount}%</span>}
                {product.is_bestseller && <span className="absolute top-4 right-4 badge-gold">Bestseller</span>}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img: string, i: number) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-[#D4AF37]' : 'border-transparent'}`}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{product.weight}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <FiStar key={s} size={14} className="text-[#D4AF37] fill-current" />)}
                </div>
                <span className="text-sm text-gray-400">4.8 (156 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-[#D4AF37]">₹{product.price}</span>
                {product.original_price && (
                  <span className="text-lg text-gray-500 line-through">₹{product.original_price}</span>
                )}
                {discount && <span className="text-green-400 text-sm font-semibold">{discount}% off</span>}
              </div>

              {product.short_description && (
                <p className="text-gray-400 mb-6 leading-relaxed">{product.short_description}</p>
              )}

              {/* Quantity + Add to cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-[#222]">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] transition-colors"><FiMinus size={14} /></button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] transition-colors"><FiPlus size={14} /></button>
                </div>
                <button onClick={handleAddToCart} className="btn-gold flex-1 gap-2">
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
              </div>

              <Link href="/checkout" className="btn-outline-gold w-full block text-center mb-8">Buy Now</Link>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-[#1E1E1E] mb-8">
                {[['🌿', 'Natural'], ['📦', 'Fresh Pack'], ['🚚', 'Fast Delivery']].map(([icon, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl mb-1">{icon}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-300 mb-3">About this product</h3>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
