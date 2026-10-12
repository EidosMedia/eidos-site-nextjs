import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({
  children,
  data,
  fullWidthContent = false,
  className = '',
}: {
  children: React.ReactNode;
  data: any;
  fullWidthContent?: boolean;
  className?: string;
}) {
  return (
    <div className="w-full flex flex-col min-h-screen bg-canvas [overflow-x:clip]">
      <Navbar data={data} />
      <main className={`flex-1 w-full ${fullWidthContent ? '' : 'max-w-page mx-auto px-space-md'} ${className}`}>
        {children}
      </main>
      <Footer data={data} />
    </div>
  );
}
