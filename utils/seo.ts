// SEO and Web Optimization utilities

/**
 * Meta tags for better SEO
 */
export const SEO_META_TAGS = {
  title: 'Agura - Premium Event Ticketing Platform',
  description: 'Discover and book amazing events with Agura. Premium event ticketing platform with secure payments, instant confirmations, and exclusive experiences.',
  keywords: 'event ticketing, concerts, shows, sports, theater, festivals, booking, tickets, events, entertainment',
  author: 'Agura Team',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  robots: 'index, follow',
  language: 'en',
  charset: 'UTF-8',
};

/**
 * Open Graph meta tags for social media sharing
 */
export const OPEN_GRAPH_TAGS = {
  'og:title': 'Agura - Premium Event Ticketing Platform',
  'og:description': 'Discover and book amazing events with Agura. Premium event ticketing platform with secure payments, instant confirmations, and exclusive experiences.',
  'og:type': 'website',
  'og:url': 'https://agura.com',
  'og:image': '/assets/images/og-image.png',
  'og:site_name': 'Agura',
  'og:locale': 'en_US',
};

/**
 * Twitter Card meta tags
 */
export const TWITTER_CARD_TAGS = {
  'twitter:card': 'summary_large_image',
  'twitter:title': 'Agura - Premium Event Ticketing Platform',
  'twitter:description': 'Discover and book amazing events with Agura. Premium event ticketing platform with secure payments, instant confirmations, and exclusive experiences.',
  'twitter:image': '/assets/images/twitter-card.png',
  'twitter:site': '@agura',
  'twitter:creator': '@agura',
};

/**
 * Structured data for events (JSON-LD)
 */
export function generateEventStructuredData(event: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date,
    endDate: event.endDate || event.date,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: event.address,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Agura',
      url: 'https://agura.com',
    },
    offers: {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://agura.com/event/${event.id}`,
    },
  };
}

/**
 * Organization structured data
 */
export const ORGANIZATION_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Agura',
  url: 'https://agura.com',
  logo: 'https://agura.com/assets/images/logo.png',
  description: 'Premium event ticketing platform connecting people with amazing experiences.',
  sameAs: [
    'https://facebook.com/agura',
    'https://twitter.com/agura',
    'https://instagram.com/agura',
    'https://linkedin.com/company/agura',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-AGURA-00',
    contactType: 'customer service',
    email: 'support@agura.com',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Event Street',
    addressLocality: 'Event City',
    addressRegion: 'EC',
    postalCode: '12345',
    addressCountry: 'US',
  },
};

/**
 * Web App Manifest for PWA
 */
export const WEB_APP_MANIFEST = {
  name: 'Agura',
  short_name: 'Agura',
  description: 'Premium Event Ticketing Platform',
  start_url: '/',
  display: 'standalone',
  background_color: '#e6007e',
  theme_color: '#e6007e',
  icons: [
    {
      src: '/assets/images/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/assets/images/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
};

/**
 * Performance optimization for web
 */
export const WEB_PERFORMANCE = {
  // Preload critical resources
  preload: [
    '/assets/fonts/main-font.woff2',
    '/assets/images/logo.png',
  ],
  // Prefetch non-critical resources
  prefetch: [
    '/assets/images/hero-bg.jpg',
    '/assets/js/non-critical.js',
  ],
  // DNS prefetch for external domains
  dnsPrefetch: [
    'https://api.agura.com',
    'https://cdn.agura.com',
  ],
  // Resource hints
  resourceHints: [
    'https://fonts.googleapis.com',
    'https://cdn.jsdelivr.net',
  ],
};
