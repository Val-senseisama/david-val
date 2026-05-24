import { useEffect } from 'react';

interface JsonLdData {
  [key: string]: unknown;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterSite?: string;
  canonical?: string;
  jsonLd?: JsonLdData | JsonLdData[];
}

export const useSEO = ({
  title,
  description,
  keywords,
  author = 'David Uyi Val-Izevbigie',
  ogTitle,
  ogDescription,
  ogType = 'website',
  ogUrl,
  ogImage = 'https://zevbii.com/og-image.png',
  ogImageWidth = '1200',
  ogImageHeight = '630',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterSite = '@val_izevbigie',
  canonical,
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    const resolvedOgImage = ogImage || 'https://zevbii.com/og-image.png';
    const resolvedTitle = ogTitle || title;

    // Update document title
    document.title = title;

    // Helper: update/create <meta name="...">
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Helper: update/create <meta property="...">
    const updatePropertyMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // ── Standard meta tags ─────────────────────────────────────────────────
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('theme-color', '#050505');

    // ── Open Graph ──────────────────────────────────────────────────────────
    updatePropertyMetaTag('og:title', resolvedTitle);
    updatePropertyMetaTag('og:description', ogDescription || description);
    updatePropertyMetaTag('og:type', ogType);
    updatePropertyMetaTag('og:site_name', 'Zevbii | David Val-Izevbigie');
    updatePropertyMetaTag('og:locale', 'en_US');
    if (ogUrl) updatePropertyMetaTag('og:url', ogUrl);
    updatePropertyMetaTag('og:image', resolvedOgImage);
    updatePropertyMetaTag('og:image:secure_url', resolvedOgImage);
    updatePropertyMetaTag('og:image:type', 'image/png');
    updatePropertyMetaTag('og:image:width', ogImageWidth);
    updatePropertyMetaTag('og:image:height', ogImageHeight);
    updatePropertyMetaTag('og:image:alt', resolvedTitle);

    // ── Twitter Card ────────────────────────────────────────────────────────
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:site', twitterSite);
    updateMetaTag('twitter:creator', twitterSite);
    updateMetaTag('twitter:title', twitterTitle || title);
    updateMetaTag('twitter:description', twitterDescription || description);
    updateMetaTag('twitter:image', resolvedOgImage);
    updateMetaTag('twitter:image:alt', resolvedTitle);

    // ── Canonical link ──────────────────────────────────────────────────────
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // ── JSON-LD structured data ─────────────────────────────────────────────
    const JSONLD_ID = 'seo-jsonld-script';
    let jsonLdScript = document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = JSONLD_ID;
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    return () => {
      document.title = 'David Uyi Val-Izevbigie - Fullstack Engineer | Zevbii';
    };
  }, [
    title, description, keywords, author, ogTitle, ogDescription, ogType,
    ogUrl, ogImage, ogImageWidth, ogImageHeight, twitterCard, twitterTitle,
    twitterDescription, twitterSite, canonical, jsonLd,
  ]);
};

// ── Pre-built JSON-LD schemas ──────────────────────────────────────────────

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'David Uyi Val-Izevbigie',
  url: 'https://zevbii.com',
  image: 'https://zevbii.com/og-image.png',
  sameAs: [
    'https://github.com/val-senseisama',
    'https://linkedin.com/in/david-val-izevbigie',
  ],
  jobTitle: 'Fullstack Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Zevbii',
  },
  knowsAbout: [
    'React', 'TypeScript', 'Node.js', 'Golang', 'Python',
    'React Native', 'Multi-tenant SaaS', 'Fintech Systems',
    'Apollo GraphQL', 'Redis', 'AI Integrations',
    'High-throughput Systems', 'Fullstack Engineering',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Zevbii | David Val-Izevbigie',
  url: 'https://zevbii.com',
  description:
    'Portfolio of David Uyi Val-Izevbigie — Fullstack Developer specializing in React, Three.js, ERP systems, and AI-powered solutions.',
  author: {
    '@type': 'Person',
    name: 'David Uyi Val-Izevbigie',
  },
};

/** Factory for per-page SoftwareApplication JSON-LD */
export const softwareAppSchema = (
  name: string,
  description: string,
  url: string,
  applicationCategory = 'WebApplication'
) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name,
  description,
  url,
  applicationCategory,
  operatingSystem: 'Web Browser',
  author: {
    '@type': 'Person',
    name: 'David Uyi Val-Izevbigie',
    url: 'https://zevbii.com',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
});