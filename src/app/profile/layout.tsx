import { generateMetadata as generateSEOMetadata, pageConfigs } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  ...pageConfigs.profile,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile`,
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
