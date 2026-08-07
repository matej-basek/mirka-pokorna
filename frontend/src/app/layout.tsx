import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mirka Pokorná | Intuitivní zpěv, muzikoterapie & spontánní tanec',
  description: 'Bezpečný prostor pro ženy. Návrat k sobě skrz hlas, zvuk, spontánní tanec a ženské kruhy. Uvolněte svobodu, emoce a sebelásku.',
  keywords: ['intuitivní zpěv', 'muzikoterapie', 'spontánní tanec', 'ženské kruhy', 'Mirka Pokorná', 'uvolnění hlasu', 'sebeláska'],
  openGraph: {
    title: 'Mirka Pokorná | Návrat k sobě skrz hlas a vědomý pohyb',
    description: 'Bezpečný prostor pro ženy, uvolnění emocí a objevování síly intuitivního zpěvu.',
    url: 'https://mirkapokorna.cz',
    siteName: 'Mirka Pokorná',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Mirka Pokorná Logo',
      },
    ],
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,900&display=swap" rel="stylesheet" />
        <link rel="preload" href="/fonts/Festigan.otf" as="font" type="font/otf" crossOrigin="anonymous" />

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
