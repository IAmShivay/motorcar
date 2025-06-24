import { generateMetadata as generateSEOMetadata, pageConfigs } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  ...pageConfigs.login,
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
