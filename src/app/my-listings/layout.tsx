import { generateMetadata as generateSEOMetadata, pageConfigs } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  ...pageConfigs.myListings,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/my-listings`,
});

export default function MyListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
