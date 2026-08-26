// app/layout.js
import './globals.css';
import { AppProvider } from './context/AppContext';

export const metadata = {
  title: 'BekasiKerja - Portal Loker & Karir Bekasi',
  description: 'Portal Lowongan Kerja, Tes Skill, dan Lifestyle Karir',
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
