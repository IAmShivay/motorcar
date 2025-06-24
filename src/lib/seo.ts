import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any>;
}

const DEFAULT_KEYWORDS = [
  'cars',
  'car listings',
  'buy cars',
  'sell cars',
  'automotive',
  'vehicles',
  'used cars',
  'car marketplace',
  'MS Motor',
  'India'
];

const SITE_CONFIG = {
  name: 'MS Motor',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Find your perfect car from our extensive collection of premium vehicles. Browse, compare, and buy with confidence.',
  ogImage: '/og-image.jpg',
  twitterHandle: '@msmotor',
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    noindex = false,
    ogImage = SITE_CONFIG.ogImage,
    ogType = 'website'
  } = config;

  const fullTitle = title.includes('MS Motor') ? title : `${title} | MS Motor`;
  const allKeywords = [...DEFAULT_KEYWORDS, ...keywords].join(', ');
  const canonicalUrl = canonical || SITE_CONFIG.url;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: 'MS Motor' }],
    creator: 'MS Motor',
    publisher: 'MS Motor',
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: ogType,
      locale: 'en_US',
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: SITE_CONFIG.twitterHandle,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };
}

export function generateJsonLd(data: Record<string, any> | Record<string, any>[]): string {
  if (Array.isArray(data)) {
    return JSON.stringify(data.map(item => ({
      '@context': 'https://schema.org',
      ...item,
    })));
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  });
}

// Common JSON-LD schemas
export const jsonLdSchemas = {
  organization: {
    '@type': 'Organization',
    name: 'MS Motor',
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98765-43210',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://facebook.com/msmotor',
      'https://twitter.com/msmotor',
      'https://instagram.com/msmotor',
      'https://linkedin.com/company/msmotor',
    ],
  },

  website: {
    '@type': 'WebSite',
    name: 'MS Motor',
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/cars?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },

  breadcrumbList: (items: Array<{ name: string; url: string }>) => ({
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  product: (car: any) => ({
    '@type': 'Product',
    name: car.title,
    description: car.description,
    brand: {
      '@type': 'Brand',
      name: car.make,
    },
    model: car.model,
    productionDate: car.year.toString(),
    color: car.color,
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    bodyType: car.bodyType,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'KMT',
    },
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'INR',
      availability: car.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Person',
        name: car.seller.name,
        telephone: car.seller.phone,
        email: car.seller.email,
      },
    },
    image: car.images.map((img: any) => img.url),
    url: `${SITE_CONFIG.url}/cars/${car.slug}`,
  }),

  localBusiness: {
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: 'MS Motor',
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: '+91-98765-43210',
    email: 'info@msmotor.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Motor Street',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.0760,
      longitude: 72.8777,
    },
    openingHours: 'Mo-Sa 09:00-18:00',
    priceRange: '₹₹',
    image: `${SITE_CONFIG.url}/business-image.jpg`,
  },

  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),
};

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: 'MS Motor - Premium Car Listings & Marketplace',
    description: 'Find your perfect car from thousands of verified listings. Buy and sell cars with confidence on India\'s trusted automotive marketplace.',
    keywords: ['car marketplace', 'buy cars online', 'sell cars', 'used cars India'],
  },

  cars: {
    title: 'Browse Cars - Find Your Perfect Vehicle',
    description: 'Explore thousands of verified car listings. Filter by make, model, price, and location to find your ideal car.',
    keywords: ['browse cars', 'car search', 'find cars', 'car listings'],
  },

  login: {
    title: 'Login to Your Account',
    description: 'Sign in to your MS Motor account to manage your car listings, save favorites, and access exclusive features.',
    keywords: ['login', 'sign in', 'account access'],
    noindex: true,
  },

  register: {
    title: 'Create Your Account',
    description: 'Join MS Motor today to list your car for sale, save your favorite listings, and connect with buyers and sellers.',
    keywords: ['register', 'sign up', 'create account'],
    noindex: true,
  },

  profile: {
    title: 'My Profile',
    description: 'Manage your MS Motor profile, update your information, and customize your account settings.',
    keywords: ['profile', 'account settings', 'user profile'],
    noindex: true,
  },

  myListings: {
    title: 'My Car Listings',
    description: 'View and manage your car listings. Edit details, track views, and communicate with potential buyers.',
    keywords: ['my listings', 'manage cars', 'car dashboard'],
    noindex: true,
  },

  sellCar: {
    title: 'Sell Your Car - List for Free',
    description: 'List your car for sale on MS Motor. Reach thousands of potential buyers with our easy-to-use listing platform.',
    keywords: ['sell car', 'list car', 'car for sale', 'free listing'],
  },
};
