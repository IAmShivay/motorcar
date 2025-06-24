import { generateMetadata as generateSEOMetadata, pageConfigs } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  ...pageConfigs.sellCar,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cars/new`,
});

export default function NewCarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
