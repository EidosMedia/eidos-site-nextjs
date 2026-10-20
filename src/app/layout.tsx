import type { Metadata } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { WebVitals } from './components/utilities/WebVitals';
import './globals.css';

config.autoAddCss = false;
import { ReloadListener } from './components/utilities/ReloadListener';
import StoreProvider from './StoreProvider';
import QueryProvider from './components/utilities/QueryProvider';

export const metadata: Metadata = {
  title: 'Neon POC site',
  description: 'Neon POC site for example purpose',
};

export default async function RootLayout({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <WebVitals />
        <ReloadListener />
        <StoreProvider>
          <QueryProvider>{children}</QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
