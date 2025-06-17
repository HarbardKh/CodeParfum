import React, { ReactNode } from 'react';
import Head from 'next/head';

interface SimpleLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function SimpleLayout({ children, title = "CodeParfum.fr" }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Site de parfums" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">CodeParfum.fr</h1>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-gray-100 p-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} CodeParfum.fr</p>
        </div>
      </footer>
    </div>
  );
} 