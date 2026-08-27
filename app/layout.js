import './globals.css';

export const metadata = {
  title: 'Portal Lowongan Kerja Bekasi & Karawang',
  description: 'Informasi lowongan kerja kawasan industri Bekasi, Cikarang, dan Karawang.',
  keywords: ['lowongan kerja', 'loker bekasi', 'loker cikarang', 'loker karawang', 'karir', 'manufaktur'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
