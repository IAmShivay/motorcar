import { generateMetadata as generateSEOMetadata, pageConfigs } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  ...pageConfigs.cars,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cars`,
});

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
