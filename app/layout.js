import './globals.css';

export const metadata = {
  title: 'BekasiKerja.id - Portal Lowongan Kerja, CV Builder & Psikotes Online',
  description: 'Temukan lowongan kerja terbaru di Bekasi, buat CV standar ATS, dan ikuti simulasi psikotes online.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
