import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'MakRiva Admin',
  description: 'MakRiva Admin Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#111', color: '#fff', border: '1px solid #222' },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#000' } },
          }}
        />
      </body>
    </html>
  );
}
