'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProduct, getProducts } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import {
  FiMinus, FiPlus, FiShoppingCart, FiStar, FiArrowLeft,
  FiPackage, FiTruck, FiShield, FiRefreshCw, FiChevronDown, FiChevronUp,
} from 'react-icons/fi';

const FALLBACK_PRODUCTS: Record<string, any> = {
  'dry-roasted-makhana': {
    id: '1', name: 'Premium Dry Roasted Makhana', slug: 'dry-roasted-makhana',
    price: 299, original_price: 499, thumbnail_url: '/images/makriva-dry-roasted.jpg',
    weight: '150g', is_bestseller: true, sku: 'MKV-DRM-150', hsn_code: '2008',
    short_description: 'Crispy, light & delicious. Zero oil, zero preservatives.',
    description: 'Our signature dry roasted makhana is slow-roasted to perfection — crispy, light, and absolutely delicious. Made from the finest Large Grade foxnuts, this variant has zero oil, zero preservatives, and maximum nutrition.\n\nHigh in protein and fiber, low in calories — the perfect snack for fitness enthusiasts and health-conscious individuals alike.',
    nutrition_info: '{"Serving Size":"30g","Calories":"107 kcal","Protein":"4.5g","Carbohydrates":"20g","Fat":"0.8g","Dietary Fiber":"0.5g","Sodium":"5mg","Calcium":"25mg","Iron":"1.4mg"}',
    additional_details: '{"Brand":"MakRiva","Country of Origin":"India","Shelf Life":"6 months","Storage":"Store in a cool, dry place","Allergen Info":"None","Net Weight":"150g","Package Type":"Resealable pouch"}',
  },
  'large-grade': {
    id: '2', name: 'Phool Makhana — Large Grade', slug: 'large-grade',
    price: 399, original_price: 650, thumbnail_url: '/images/makriva-large-grade.jpg',
    weight: '250g', is_featured: true, sku: 'MKV-LGM-250', hsn_code: '2008',
    short_description: 'Largest grade foxnuts. Premium quality, handpicked.',
    description: 'Our Large Grade Phool Makhana represents the pinnacle of makhana quality. Carefully handpicked, only the largest and most uniform lotus seeds make it into this premium pack.\n\nPerfect for cooking, roasting at home, or gifting to loved ones.',
    nutrition_info: '{"Serving Size":"30g","Calories":"99 kcal","Protein":"4g","Carbohydrates":"19g","Fat":"0.5g","Dietary Fiber":"0.6g","Sodium":"1mg","Calcium":"23mg","Iron":"1.3mg"}',
    additional_details: '{"Brand":"MakRiva","Country of Origin":"India","Shelf Life":"12 months","Storage":"Store in a cool, dry place","Net Weight":"250g","Grade":"Large (8–10 mm)","Package Type":"Sealed pouch"}',
  },
  'medium-grade': {
    id: '3', name: 'Phool Makhana — Medium Grade', slug: 'medium-grade',
    price: 299, original_price: 549, thumbnail_url: '/images/makriva-medium-grade.jpg',
    weight: '250g', sku: 'MKV-MGM-250', hsn_code: '2008',
    short_description: 'Perfect everyday makhana. Great value, excellent quality.',
    description: 'Our Medium Grade makhana offers excellent value without compromising on quality. Perfect for everyday snacking and cooking.',
    nutrition_info: '{"Serving Size":"30g","Calories":"99 kcal","Protein":"4g","Carbohydrates":"19g","Fat":"0.5g","Dietary Fiber":"0.6g","Sodium":"1mg","Calcium":"23mg"}',
    additional_details: '{"Brand":"MakRiva","Country of Origin":"India","Shelf Life":"12 months","Storage":"Store in a cool, dry place","Net Weight":"250g","Grade":"Medium (6–8 mm)"}',
  },
  'rock-salt-pepper': {
    id: '4', name: 'Rock Salt & Pepper', slug: 'rock-salt-pepper',
    price: 249, original_price: 399, thumbnail_url: '/images/rock-salt-pepper.png',
    weight: '100g', sku: 'MKV-RSP-100', hsn_code: '2008',
    short_description: 'Classic Himalayan rock salt & black pepper seasoning.',
    description: 'A timeless classic — our Large Grade makhana seasoned with Himalayan rock salt and freshly ground black pepper.',
    nutrition_info: '{"Serving Size":"25g","Calories":"88 kcal","Protein":"3.5g","Carbohydrates":"17g","Fat":"0.7g","Sodium":"95mg"}',
    additional_details: '{"Brand":"MakRiva","Flavour":"Rock Salt & Pepper","Net Weight":"100g","Contains":"Makhana, Himalayan Rock Salt, Black Pepper"}',
  },
  'pudina-fresh': {
    id: '5', name: 'Pudina Fresh', slug: 'pudina-fresh',
    price: 249, original_price: 399, thumbnail_url: '/images/pudina-fresh.png',
    weight: '100g', sku: 'MKV-PUD-100', hsn_code: '2008',
    short_description: 'Refreshing mint flavour on premium makhana.',
    description: 'Refreshing mint (pudina) seasoning on our premium makhana. A cool, refreshing flavour that makes for the perfect summer snack.',
    nutrition_info: '{"Serving Size":"25g","Calories":"86 kcal","Protein":"3.5g","Carbohydrates":"17g","Fat":"0.6g","Sodium":"80mg"}',
    additional_details: '{"Brand":"MakRiva","Flavour":"Pudina (Mint)","Net Weight":"100g","Contains":"Makhana, Mint Powder, Spices"}',
  },
  'chilli-cheese': {
    id: '6', name: 'Chilli Cheese', slug: 'chilli-cheese',
    price: 249, original_price: 399, thumbnail_url: '/images/chilly-cheese.png',
    weight: '100g', sku: 'MKV-CCH-100', hsn_code: '2008',
    short_description: 'Spicy chilli + rich cheese. Bold & addictive.',
    description: 'Bold and spicy chilli with rich cheese seasoning on our premium makhana. For those who love their snacks with a kick!',
    nutrition_info: '{"Serving Size":"25g","Calories":"92 kcal","Protein":"3.8g","Carbohydrates":"16g","Fat":"1.2g","Sodium":"110mg"}',
    additional_details: '{"Brand":"MakRiva","Flavour":"Chilli Cheese","Net Weight":"100g","Contains":"Makhana, Cheese Powder, Chilli"}',
  },
};

const TABS = ['Description', 'Nutrition Facts', 'Details'];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct]     = useState<any>(null);
  const [related, setRelated]     = useState<any[]>([]);
  const [qty, setQty]             = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [expandFaq, setExpandFaq] = useState<number | null>(null);
  const { user } = useAuth();
  const { addItem, addLocal } = useCart();

  useEffect(() => {
    setLoading(true);
    getProduct(id as string)
      .then(setProduct)
      .catch(() => setProduct(FALLBACK_PRODUCTS[id as string] || null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    getProducts({ limit: 6 })
      .then((all: any[]) => setRelated(all.filter((p: any) => p.slug !== product.slug).slice(0, 4)))
      .catch(() => {});
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (user) { addItem(product.id, qty); }
    else { addLocal({ product_id: product.id, name: product.name, price: product.price, quantity: qty, thumbnail_url: product.thumbnail_url || null, weight: product.weight || null }); }
  };

  if (loading) return (
    <><Navbar />
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div><Footer /></>
  );

  if (!product) return (
    <><Navbar />
    <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
      <h1 className="text-2xl text-[#686B78]">Product not found</h1>
      <Link href="/products" className="btn-gold">Back to Shop</Link>
    </div><Footer /></>
  );

  // Sort images: primary first, then by sort_order
  const sortedImages = product.images?.length
    ? [...product.images].sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return (a.sort_order || 0) - (b.sort_order || 0);
      })
    : [];
  const images = sortedImages.length
    ? sortedImages.map((i: any) => i.url)
    : [product.thumbnail_url || '/images/makriva-dry-roasted.jpg'];

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let nutritionData: any = {};
  try { if (product.nutrition_info) nutritionData = JSON.parse(product.nutrition_info); } catch {}

  // Detect format: nested = has a "nutrition" key with nested objects
  const isNestedNutrition = nutritionData && typeof nutritionData.nutrition === 'object' && !Array.isArray(nutritionData.nutrition);

  let additionalData: Record<string, string> = {};
  try { if (product.additional_details) additionalData = JSON.parse(product.additional_details); } catch {}

  const faqs = [
    { q: 'Is this product suitable for diabetics?', a: 'Makhana has a low glycaemic index (GI ≈ 50) making it a good snack choice for diabetics. However, please consult your doctor for personalised advice.' },
    { q: 'Does this contain any preservatives?', a: 'No. Our makhana contains absolutely zero artificial preservatives or additives. Freshness is preserved through nitrogen-flushed packaging.' },
    { q: 'Can children eat this?', a: 'Yes! Makhana is a nutritious, age-appropriate snack for children above 3 years. It is a natural, wholesome food with no artificial additives.' },
    { q: 'How long does an opened pack stay fresh?', a: 'Once opened, store in an airtight container. The product stays fresh for up to 2 weeks after opening.' },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-[#FAFAFA] min-h-screen pt-[68px] pb-20">

        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#F0F0F0] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-sm text-[#686B78]">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand transition-colors">Products</Link>
            <span>/</span>
            <span className="text-[#1C1C1C] font-medium truncate">{product.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* ── Images ──────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="relative aspect-square bg-white border border-[#F0F0F0] rounded-2xl overflow-hidden">
                <Image src={images[activeImage]} alt={product.name} fill className="object-cover" />
                {discount && <span className="absolute top-4 left-4 badge-gold" style={{ background: '#16a34a' }}>-{discount}%</span>}
                {product.is_bestseller && <span className="absolute top-4 right-4 badge-gold">Bestseller</span>}
                {product.is_featured && !product.is_bestseller && <span className="absolute top-4 right-4 badge-gold">Featured</span>}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                  {images.map((img: string, i: number) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${i === activeImage ? 'border-brand' : 'border-[#F0F0F0]'}`}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Assurance badges */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  { icon: <FiPackage size={16} className="text-brand" />, label: 'Sealed Pack' },
                  { icon: <FiTruck size={16} className="text-brand" />, label: 'Pan-India' },
                  { icon: <FiShield size={16} className="text-brand" />, label: '100% Natural' },
                  { icon: <FiRefreshCw size={16} className="text-brand" />, label: 'Easy Return' },
                ].map(b => (
                  <div key={b.label} className="bg-white border border-[#F0F0F0] rounded-xl p-3 flex flex-col items-center gap-1.5 text-center">
                    {b.icon}
                    <span className="text-[10px] font-semibold text-[#686B78] leading-tight">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Product Info ─────────────────────────────────── */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-card p-6 lg:p-8">
                {product.weight && (
                  <p className="text-xs font-bold text-[#686B78] uppercase tracking-widest mb-2">{product.weight}</p>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C1C1C] mb-3">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <FiStar key={s} size={14} className="text-[#FFB800] fill-current" />)}
                  </div>
                  <span className="text-sm text-[#686B78]">4.8 (156 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-extrabold text-brand">₹{product.price}</span>
                  {product.original_price && <span className="text-lg text-[#686B78] line-through">₹{product.original_price}</span>}
                  {discount && <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-0.5 rounded-full">{discount}% off</span>}
                </div>

                {/* Inclusive tax note */}
                <p className="text-xs text-[#93959F] mb-4">Incl. all taxes. Free delivery on orders above ₹499.</p>

                {/* Short description */}
                {product.short_description && (
                  <p className="text-[#686B78] mb-5 leading-relaxed text-sm border-l-2 border-brand pl-3">
                    {product.short_description}
                  </p>
                )}

                {/* SKU + HSN */}
                {(product.sku || product.hsn_code) && (
                  <div className="flex flex-wrap gap-4 mb-5 text-xs text-[#686B78]">
                    {product.sku && <span>SKU: <strong className="text-[#1C1C1C]">{product.sku}</strong></span>}
                    {product.hsn_code && <span>HSN: <strong className="text-[#1C1C1C]">{product.hsn_code}</strong></span>}
                  </div>
                )}

                {/* Quantity + Add to cart */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center border border-[#E9E9EB] rounded-xl overflow-hidden">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center text-[#686B78] hover:text-brand hover:bg-brand-50 transition-colors"><FiMinus size={14} /></button>
                    <span className="w-10 text-center font-bold text-[#1C1C1C]">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="w-10 h-11 flex items-center justify-center text-[#686B78] hover:text-brand hover:bg-brand-50 transition-colors"><FiPlus size={14} /></button>
                  </div>
                  <button onClick={handleAddToCart} className="btn-gold flex-1 gap-2 py-3">
                    <FiShoppingCart size={18} /> Add to Cart
                  </button>
                </div>

                <Link href="/checkout" className="btn-outline-gold w-full block text-center mb-5">Buy Now →</Link>

                {/* Quick features */}
                <div className="grid grid-cols-3 gap-3 py-4 border-t border-[#F0F0F0]">
                  {[['🌿', 'Natural'], ['🚫', 'No Preservatives'], ['🌾', 'Gluten Free'], ['💪', 'High Protein'], ['📦', 'Fresh Pack'], ['🚚', 'Pan-India']].map(([icon, label]) => (
                    <div key={label} className="text-center">
                      <div className="text-xl mb-1">{icon}</div>
                      <div className="text-[10px] font-semibold text-[#686B78]">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery info card */}
              <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-card p-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <FiTruck size={16} className="text-brand mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1C1C1C]">Free Delivery on ₹499+</p>
                      <p className="text-xs text-[#686B78]">Delivered within 4–7 business days across India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <FiRefreshCw size={16} className="text-brand mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1C1C1C]">7-Day Easy Returns</p>
                      <p className="text-xs text-[#686B78]">Not satisfied? Contact us within 7 days of delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <FiShield size={16} className="text-brand mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1C1C1C]">Quality Guaranteed</p>
                      <p className="text-xs text-[#686B78]">Every batch undergoes rigorous quality checks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs Section ─────────────────────────────────────── */}
          <div className="mt-12 bg-white rounded-2xl border border-[#F0F0F0] shadow-card overflow-hidden">
            {/* Tab headers */}
            <div className="flex border-b border-[#F0F0F0] overflow-x-auto scrollbar-hide">
              {TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveTab(i)}
                  className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                    i === activeTab ? 'border-brand text-brand' : 'border-transparent text-[#686B78] hover:text-[#1C1C1C]'
                  }`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6 lg:p-8">
              {/* Description */}
              {activeTab === 0 && (
                <div>
                  {product.description ? (
                    <p className="text-[#686B78] text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
                  ) : (
                    <p className="text-[#686B78] text-sm">No description available.</p>
                  )}

                  {/* Key highlights */}
                  <div className="mt-8 grid sm:grid-cols-2 gap-4">
                    <h3 className="sm:col-span-2 font-extrabold text-sm uppercase tracking-widest text-[#1C1C1C] mb-1">Key Highlights</h3>
                    {[
                      ['🌿', 'Zero artificial colours, flavours, or preservatives'],
                      ['💪', 'High protein — great for weight management'],
                      ['🔥', 'Low calorie — only ~100 kcal per 30g serving'],
                      ['🌾', 'Naturally gluten-free and vegan'],
                      ['🏆', "Sourced directly from Bihar's finest farms"],
                      ['📦', 'Nitrogen-flushed packaging for maximum freshness'],
                    ].map(([icon, text]) => (
                      <div key={text} className="flex items-start gap-3 text-sm text-[#686B78]">
                        <span className="text-lg shrink-0">{icon}</span>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* How to enjoy */}
                  <div className="mt-8 p-5 bg-brand-50 rounded-xl border border-brand/10">
                    <h3 className="font-extrabold text-sm uppercase tracking-widest text-[#1C1C1C] mb-3">Ways to Enjoy</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        ['🍿', 'As a Snack', 'Eat straight from the pack — no prep needed.'],
                        ['🥛', 'With Milk / Kheer', 'Soak in warm milk for a classic makhana kheer.'],
                        ['🥗', 'In Salads', 'Toss into salads for a protein-packed crunch.'],
                        ['🍛', 'In Curries', 'Add to gravies and curries for texture.'],
                        ['🧁', 'In Desserts', 'Use in laddoos, halwa, or barfi recipes.'],
                        ['🏋️', 'Post-Workout', 'A clean, high-protein recovery snack.'],
                      ].map(([icon, title, desc]) => (
                        <div key={title} className="bg-white rounded-xl p-3 border border-[#F0F0F0]">
                          <div className="text-2xl mb-1">{icon}</div>
                          <p className="text-xs font-bold text-[#1C1C1C] mb-0.5">{title}</p>
                          <p className="text-xs text-[#686B78]">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Nutrition Facts */}
              {activeTab === 1 && (
                <div>
                  {Object.keys(nutritionData).length > 0 ? (
                    <div className="max-w-lg">
                      <div className="border-4 border-[#1C1C1C] p-4 rounded-lg">
                        <h3 className="text-2xl font-black text-[#1C1C1C] border-b-8 border-[#1C1C1C] pb-1 mb-2">Nutrition Facts</h3>

                        {/* Serving size row */}
                        {(isNestedNutrition ? nutritionData.serve_size : nutritionData['Serving Size']) && (
                          <p className="text-sm font-semibold text-[#1C1C1C] mb-2 border-b border-[#1C1C1C] pb-1">
                            Serving Size: {isNestedNutrition ? nutritionData.serve_size : nutritionData['Serving Size']}
                          </p>
                        )}

                        {/* Nested format: two-column table (per 100g / per serve) */}
                        {isNestedNutrition ? (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b-2 border-[#1C1C1C]">
                                <th className="py-1.5 text-left font-black text-[#1C1C1C]">Nutrient</th>
                                <th className="py-1.5 text-right font-black text-[#1C1C1C]">Per 100g</th>
                                <th className="py-1.5 text-right font-black text-[#1C1C1C] pl-4">Per Serve</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(nutritionData.nutrition as Record<string, Record<string, string>>).map(([nutrient, vals]) => (
                                <tr key={nutrient} className="border-b border-[#E0E0E0]">
                                  <td className="py-1.5 font-semibold text-[#1C1C1C] capitalize">{nutrient.replace(/_/g, ' ')}</td>
                                  <td className="py-1.5 text-right text-[#686B78]">{vals.per_100g ?? '—'}</td>
                                  <td className="py-1.5 text-right text-[#686B78] pl-4">{vals.per_serve ?? '—'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          /* Flat format: original single-column layout */
                          <>
                            {nutritionData['Calories'] && (
                              <div className="flex items-end justify-between border-b-4 border-[#1C1C1C] pb-1 mb-2">
                                <span className="font-black text-[#1C1C1C]">Calories</span>
                                <span className="text-3xl font-black text-[#1C1C1C]">{nutritionData['Calories']}</span>
                              </div>
                            )}
                            <table className="w-full text-sm">
                              <tbody>
                                {Object.entries(nutritionData as Record<string, string>)
                                  .filter(([k]) => k !== 'Serving Size' && k !== 'Calories')
                                  .map(([key, val]) => (
                                    <tr key={key} className="border-b border-[#E0E0E0]">
                                      <td className="py-1.5 font-semibold text-[#1C1C1C]">{key}</td>
                                      <td className="py-1.5 text-right text-[#686B78]">{val}</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </>
                        )}

                        {/* Notes */}
                        {isNestedNutrition && Array.isArray(nutritionData.notes) && nutritionData.notes.length > 0 && (
                          <ul className="mt-3 space-y-0.5">
                            {(nutritionData.notes as string[]).map((note: string, i: number) => (
                              <li key={i} className="text-xs text-[#93959F]">* {note}</li>
                            ))}
                          </ul>
                        )}
                        {!isNestedNutrition && (
                          <p className="text-xs text-[#93959F] mt-3">* Approximate values. Actual values may vary slightly by batch.</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#686B78] text-sm">Nutrition information not yet available for this product.</p>
                  )}
                </div>
              )}

              {/* Additional Details */}
              {activeTab === 2 && (
                <div className="space-y-6">
                  {/* Product description paragraph */}
                  {additionalData.description && (
                    <p className="text-sm text-[#686B78] leading-relaxed">{String(additionalData.description)}</p>
                  )}

                  {/* Highlights bullet list */}
                  {Array.isArray(additionalData.highlights) && additionalData.highlights.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-[#1C1C1C] mb-3 uppercase tracking-wider">Highlights</h4>
                      <ul className="space-y-2">
                        {(additionalData.highlights as string[]).map((h: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#686B78]">
                            <span className="text-brand mt-0.5 shrink-0">✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Key-value table: SKU/HSN/weight + any simple string fields + nested additional_details object */}
                  {(product.sku || product.hsn_code || product.weight ||
                    Object.entries(additionalData).some(([k, v]) =>
                      !['description', 'highlights', 'notes', 'product_name'].includes(k) &&
                      (typeof v === 'string' || typeof v === 'number' ||
                       (typeof v === 'object' && !Array.isArray(v) && v !== null))
                    )
                  ) && (
                    <div className="overflow-hidden border border-[#F0F0F0] rounded-xl">
                      <table className="w-full text-sm">
                        <tbody>
                          {product.sku && (
                            <tr className="border-b border-[#F0F0F0]">
                              <td className="px-5 py-3.5 font-semibold text-[#1C1C1C] bg-[#FAFAFA] w-1/3">SKU</td>
                              <td className="px-5 py-3.5 text-[#686B78]">{product.sku}</td>
                            </tr>
                          )}
                          {product.hsn_code && (
                            <tr className="border-b border-[#F0F0F0]">
                              <td className="px-5 py-3.5 font-semibold text-[#1C1C1C] bg-[#FAFAFA]">HSN Code</td>
                              <td className="px-5 py-3.5 text-[#686B78]">{product.hsn_code}</td>
                            </tr>
                          )}
                          {product.weight && (
                            <tr className="border-b border-[#F0F0F0]">
                              <td className="px-5 py-3.5 font-semibold text-[#1C1C1C] bg-[#FAFAFA]">Net Weight</td>
                              <td className="px-5 py-3.5 text-[#686B78]">{product.weight}</td>
                            </tr>
                          )}
                          {Object.entries(additionalData)
                            .filter(([k]) => !['description', 'highlights', 'notes', 'product_name'].includes(k))
                            .flatMap(([key, val]) => {
                              const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                              if (typeof val === 'string' || typeof val === 'number') {
                                return [(
                                  <tr key={key} className="border-b border-[#F0F0F0] last:border-0">
                                    <td className="px-5 py-3.5 font-semibold text-[#1C1C1C] bg-[#FAFAFA] w-1/3">{label}</td>
                                    <td className="px-5 py-3.5 text-[#686B78]">{String(val)}</td>
                                  </tr>
                                )];
                              }
                              if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
                                return Object.entries(val as Record<string, unknown>).map(([subKey, subVal]) => (
                                  <tr key={`${key}-${subKey}`} className="border-b border-[#F0F0F0] last:border-0">
                                    <td className="px-5 py-3.5 font-semibold text-[#1C1C1C] bg-[#FAFAFA] w-1/3">
                                      {subKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                    </td>
                                    <td className="px-5 py-3.5 text-[#686B78]">{String(subVal)}</td>
                                  </tr>
                                ));
                              }
                              return [];
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Notes footnotes */}
                  {Array.isArray(additionalData.notes) && additionalData.notes.length > 0 && (
                    <ul className="space-y-0.5">
                      {(additionalData.notes as string[]).map((note: string, i: number) => (
                        <li key={i} className="text-xs text-[#93959F]">* {note}</li>
                      ))}
                    </ul>
                  )}

                  {/* Fallback empty state */}
                  {!product.sku && !product.hsn_code && !product.weight && Object.keys(additionalData).length === 0 && (
                    <p className="text-[#686B78] text-sm">No additional details available for this product.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── FAQ Section ──────────────────────────────────────── */}
          <div className="mt-10 bg-white rounded-2xl border border-[#F0F0F0] shadow-card p-6 lg:p-8">
            <h2 className="text-lg font-extrabold text-[#1C1C1C] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-[#F0F0F0] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandFaq(expandFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#1C1C1C] hover:bg-[#FAFAFA] transition-colors"
                  >
                    {faq.q}
                    {expandFaq === i ? <FiChevronUp size={16} className="text-brand shrink-0" /> : <FiChevronDown size={16} className="text-[#686B78] shrink-0" />}
                  </button>
                  {expandFaq === i && (
                    <div className="px-5 pb-4 text-sm text-[#686B78] leading-relaxed border-t border-[#F0F0F0]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Related Products ─────────────────────────────────── */}
          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-extrabold text-[#1C1C1C] mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p: any) => {
                  const pDiscount = p.original_price ? Math.round((1 - p.price / p.original_price) * 100) : null;
                  return (
                    <Link key={p.id} href={`/products/${p.slug}`} className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative aspect-square bg-[#F8F8F8]">
                        {p.thumbnail_url ? (
                          <Image src={p.thumbnail_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">🫙</div>
                        )}
                        {pDiscount && <span className="absolute top-2 left-2 text-xs font-bold bg-green-500 text-white px-2 py-0.5 rounded-full">-{pDiscount}%</span>}
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold text-[#1C1C1C] mb-1 line-clamp-2">{p.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-brand font-extrabold text-sm">₹{p.price}</span>
                          {p.original_price && <span className="text-xs text-[#686B78] line-through">₹{p.original_price}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
