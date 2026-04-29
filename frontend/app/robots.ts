import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/orders', '/profile', '/api/'],
      },
    ],
    sitemap: 'https://makriva.in/sitemap.xml',
    host: 'https://makriva.in',
  };
}
