'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from './ProductCard';
import { getProducts } from '@/lib/api';

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-[#F0F0F0]">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded-full w-1/3" />
        <div className="h-4 skeleton rounded-full w-3/4" />
        <div className="h-3 skeleton rounded-full w-1/2" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-5 skeleton rounded-full w-16" />
          <div className="h-8 skeleton rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getProducts({ limit: 6 })
      .then(data => setProducts(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-subtitle text-xs font-bold tracking-widest uppercase text-brand mb-1">
              Our Collection
            </p>
            <h2 className="section-title">Popular right now</h2>
            <div className="w-10 h-1 bg-brand rounded-full mt-2" />
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline transition-all"
          >
            View All <FiArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-[#93959F]">
            Products coming soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        <div className="text-center mt-10 sm:hidden">
          <Link href="/products" className="btn-outline-gold inline-flex items-center gap-2">
            View All Products <FiArrowRight size={15} />
          </Link>
        </div>

        {/* Desktop CTA (full width) */}
        {!loading && products.length > 0 && (
          <div className="hidden sm:flex justify-center mt-12">
            <Link
              href="/products"
              className="btn-outline-gold inline-flex items-center gap-2 px-10"
            >
              See All Products <FiArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
