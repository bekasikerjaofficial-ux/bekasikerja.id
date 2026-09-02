import './globals.css';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
