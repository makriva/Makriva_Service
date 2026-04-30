'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { FiSearch, FiX, FiFilter } from 'react-icons/fi';

const CATEGORIES = [
  { id: 'all',        label: '🌾 All',          filter: () => true },
  { id: 'bestseller', label: '🏆 Bestsellers',   filter: (p: any) => p.is_bestseller },
  { id: 'featured',   label: '⭐ Featured',      filter: (p: any) => p.is_featured },
  { id: 'flavored',   label: '🌶 Flavoured',     filter: (p: any) => /chilli|masala|pudina|pepper|cheese|spic/i.test(p.name) },
  { id: 'plain',      label: '🧂 Plain & Natural', filter: (p: any) => /plain|natural|dry|roasted|rock salt/i.test(p.name) },
  { id: 'premium',    label: '✨ Premium',        filter: (p: any) => /premium|large|grade a/i.test(p.name) },
];

const SORTS = [
  { value: 'default',    label: 'Most Popular' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name',       label: 'Name A–Z' },
];

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

function ProductsContent() {
  const searchParams        = useSearchParams();
  const initialQuery        = searchParams.get('q') || '';
  const categoryRef         = useRef<HTMLDivElement>(null);

  const [products, setProducts]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState(initialQuery);
  const [activeSearch, setActiveSearch] = useState(initialQuery);
  const [sortBy, setSortBy]       = useState('default');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showSort, setShowSort]   = useState(false);

  useEffect(() => {
    getProducts({ limit: 100 })
      .then(d => setProducts(d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Apply filters + sort
  const filtered = (() => {
    let result = [...products];

    // Category filter
    const cat = CATEGORIES.find(c => c.id === activeCategory);
    if (cat && cat.id !== 'all') result = result.filter(cat.filter);

    // Search filter
    if (activeSearch.trim()) {
      const q = activeSearch.trim().toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'name')       result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  })();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(search);
  };

  const clearSearch = () => { setSearch(''); setActiveSearch(''); };

  return (
    <>
      <Navbar />
      <main className="bg-[#FAFAFA] min-h-screen pt-[68px]">

        {/* ── Page header band ─────────────────────────────── */}
        <div className="bg-white border-b border-[#F0F0F0] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-widest uppercase text-brand mb-1">Browse</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1C1C1C]">Buy Premium Makhana Online</h1>
            <p className="text-[#686B78] text-sm mt-1">Healthy phool makhana (fox nuts) — dry roasted, flavoured & raw. Natural, high protein, zero preservatives.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Search + Sort bar ────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative flex-1">
              <FiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#93959F]" />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-food pl-11 pr-10 py-3"
              />
              {search && (
                <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#93959F] hover:text-brand transition-colors">
                  <FiX size={15} />
                </button>
              )}
            </form>

            {/* Sort dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E9E9EB] bg-white text-sm font-semibold text-[#1C1C1C] hover:border-brand transition-colors w-full sm:w-auto"
              >
                <FiFilter size={15} className="text-brand" />
                {SORTS.find(s => s.value === sortBy)?.label}
              </button>
              {showSort && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-52 bg-white border border-[#E9E9EB] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] py-2 z-30 animate-fade-in">
                  {SORTS.map(s => (
                    <button
                      key={s.value}
                      onClick={() => { setSortBy(s.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === s.value
                          ? 'text-brand font-bold bg-brand-50'
                          : 'text-[#1C1C1C] hover:bg-[#F8F8F8]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Category chips ───────────────────────────────── */}
          <div
            ref={categoryRef}
            className="flex gap-2.5 overflow-x-auto pb-2 mb-8 scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-pill shrink-0 ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── Results count ────────────────────────────────── */}
          {!loading && (
            <p className="text-[#686B78] text-sm mb-5 font-medium">
              {filtered.length === 0
                ? 'No products found'
                : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
              {activeSearch && <span> for <span className="font-bold text-[#1C1C1C]">&ldquo;{activeSearch}&rdquo;</span></span>}
            </p>
          )}

          {/* ── Grid ─────────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-5">🔍</span>
              <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">Nothing found</h3>
              <p className="text-[#686B78] text-sm mb-6">
                {activeSearch
                  ? `No products match "${activeSearch}". Try a different search.`
                  : 'No products in this category yet.'}
              </p>
              <button
                onClick={() => { clearSearch(); setActiveCategory('all'); }}
                className="btn-gold px-8"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}
