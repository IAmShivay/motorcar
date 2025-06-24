import Link from 'next/link';
import { Search, Car, Shield, Users, Star, ArrowRight } from 'lucide-react';
import { generateMetadata as generateSEOMetadata, generateJsonLd, jsonLdSchemas, pageConfigs } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  ...pageConfigs.home,
  canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  jsonLd: {
    ...jsonLdSchemas.organization,
    ...jsonLdSchemas.website,
  },
});

export default function Home() {
  const features = [
    {
      icon: Car,
      title: 'Wide Selection',
      description: 'Browse through thousands of verified cars from trusted sellers across India.',
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'All transactions are protected with advanced security measures and verification.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Our team of automotive experts is here to help you every step of the way.',
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Every car listing is verified and comes with detailed inspection reports.',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Cars Listed' },
    { number: '5,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '99%', label: 'Customer Satisfaction' },
  ];

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateJsonLd([
            jsonLdSchemas.organization,
            jsonLdSchemas.website,
            jsonLdSchemas.localBusiness,
          ]),
        }}
      />

      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Car
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover thousands of verified cars from trusted sellers.
              Buy with confidence, sell with ease.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-lg p-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by make, model, or location..."
                    className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-0 focus:outline-none rounded-md bg-white"
                  />
                </div>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Cars</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/cars"
                className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse All Cars
              </Link>
              <Link
                href="/cars/new"
                className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sell Your Car
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MS Motor?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make car buying and selling simple, secure, and transparent.
              Here&apos;s what sets us apart from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Find Your Next Car?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect car through MS Motor.
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            <span>Start Browsing</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
