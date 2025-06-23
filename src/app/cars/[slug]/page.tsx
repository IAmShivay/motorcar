import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CarDetailPage } from '@/components/CarDetailPage';
import { carApi } from '@/lib/api';
import { extractCarIdFromSlug, generateCarMetaDescription, generateCarJsonLd } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const carId = extractCarIdFromSlug(params.slug);
    const response = await carApi.getCar(carId);
    
    if (!response.success || !response.data) {
      return {
        title: 'Car Not Found - MS Motor',
        description: 'The requested car listing could not be found.',
      };
    }

    const car = response.data;
    const title = `${car.title} - ${car.formattedPrice} | MS Motor`;
    const description = generateCarMetaDescription(car);
    const images = car.images.map(img => img.url);

    return {
      title,
      description,
      keywords: [
        car.make,
        car.model,
        car.year.toString(),
        car.fuelType,
        car.transmission,
        car.bodyType,
        car.location.city,
        car.location.state,
        'used car',
        'car for sale',
        'buy car',
      ].join(', '),
      authors: [{ name: 'MS Motor' }],
      creator: 'MS Motor',
      publisher: 'MS Motor',
      robots: 'index, follow',
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/cars/${params.slug}`,
        siteName: 'MS Motor',
        title,
        description,
        images: images.map(url => ({
          url,
          width: 800,
          height: 600,
          alt: car.title,
        })),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: images.slice(0, 1), // Twitter supports only one image
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/cars/${params.slug}`,
      },
    };
  } catch {
    return {
      title: 'Car Not Found - MS Motor',
      description: 'The requested car listing could not be found.',
    };
  }
}

export default async function CarPage({ params }: Props) {
  try {
    const carId = extractCarIdFromSlug(params.slug);
    const response = await carApi.getCar(carId);
    
    if (!response.success || !response.data) {
      notFound();
    }

    const car = response.data;
    const jsonLd = generateCarJsonLd(car);

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        
        <CarDetailPage car={car} />
      </>
    );
  } catch {
    notFound();
  }
}
