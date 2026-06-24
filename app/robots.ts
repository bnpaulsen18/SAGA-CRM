import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://saga-crm.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/contacts/',
          '/donations/',
          '/campaigns/',
          '/reports/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
