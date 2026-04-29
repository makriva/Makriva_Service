import { MetadataRoute } from 'next';

const BASE = 'https://makriva.in';

const staticRoutes: MetadataRoute.Sitemap = [
  { url: BASE,                                  lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/products`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/privacy`,                     lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/shipping-policy`,             lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/return-policy`,               lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/terms`,                       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  { url: `${BASE}/cancellation-policy`,         lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
];

// Known product slugs — update this list as you add products
const productSlugs = [
  'dry-roasted-makhana',
  'large-grade',
  'medium-grade',
];

const productRoutes: MetadataRoute.Sitemap = productSlugs.map(slug => ({
  url: `${BASE}/products/${slug}`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.8,
}));

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticRoutes, ...productRoutes];
}
