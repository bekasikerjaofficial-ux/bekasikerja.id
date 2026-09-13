import './globals.css';
import AnalyticsTracker from '../components/AnalyticsTracker';

export const metadata = {
  title: 'Portal Lowongan Kerja Bekasi & Karawang',
  description: 'Informasi lowongan kerja kawasan industri Bekasi, Cikarang, dan Karawang.',
  keywords: ['lowongan kerja', 'loker bekasi', 'loker cikarang', 'loker karawang', 'karir', 'manufaktur'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="google-site-verification" content="LgV02PAoMZm0SUZalTtOVlc2uz60Tt0ihtNti7QAEIE" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap" as="style" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <link rel="preload" href="/icon.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/placeholder.svg" as="image" type="image/svg+xml" />
        <meta name="theme-color" content="#005cab" />
      </head>
      <body style={{ fontFamily: 'var(--font-sans)' }}>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
