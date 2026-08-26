import './globals.css';
import { AppProvider } from './AppContext';

export const metadata = {
  title: 'Portal Lowongan Kerja Bekasi & Karawang',
  description: 'Informasi lowongan kerja kawasan industri Bekasi, Cikarang, dan Karawang.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
