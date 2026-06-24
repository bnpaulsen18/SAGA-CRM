/**
 * Structured Data (JSON-LD) Component
 * Helps search engines understand your content better
 */

export interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    email?: string;
    telephone?: string;
  };
}

export interface SoftwareApplicationSchema {
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

interface StructuredDataProps {
  type: 'Organization' | 'SoftwareApplication' | 'WebSite';
  data: OrganizationSchema | SoftwareApplicationSchema | any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Predefined schemas for common use cases
 */
export function OrganizationStructuredData() {
  const schema: OrganizationSchema = {
    name: 'SAGA CRM',
    url: process.env.NEXTAUTH_URL || 'https://saga-crm.com',
    logo: `${process.env.NEXTAUTH_URL || 'https://saga-crm.com'}/SAGA_Logo_final.png`,
    description:
      'Modern CRM built for nonprofits. Manage donors, track donations, run campaigns, and grow your mission.',
  };

  return <StructuredData type="Organization" data={schema} />;
}

export function SoftwareApplicationStructuredData() {
  const schema: SoftwareApplicationSchema = {
    name: 'SAGA CRM',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return <StructuredData type="SoftwareApplication" data={schema} />;
}

export function WebSiteStructuredData() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://saga-crm.com';

  const schema = {
    name: 'SAGA CRM',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <StructuredData type="WebSite" data={schema} />;
}
