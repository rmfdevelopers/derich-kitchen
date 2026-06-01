import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const heading = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-heading',
  weight: ['400', '700', '900']
});

const body = DM_Sans({ 
  subsets: ['latin'], 
  variable: '--font-body',
  weight: ['300', '400', '500', '700']
});

export const metadata = {
  title: "De'rich Kitchen | Luxury Gourmet Catering Lagos",
  description: "Premium gourmet lunch packs and executive event catering by Chef C.P."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}