import React, { ReactNode } from 'react';
import Head from 'next/head';

interface MinimalLayoutProps {
  children: ReactNode;
  title?: string;
}

const MinimalLayout: React.FC<MinimalLayoutProps> = ({ children, title = 'CodeParfum.fr' }) => {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Version simplifiée pour tests" />
      </Head>

      <main className="w-full py-8 px-4 max-w-4xl mx-auto">
        {children}
      </main>

      <footer className="w-full py-4 border-t border-gray-200 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CodeParfum.fr. Tous droits réservés.
      </footer>
    </div>
  );
};

export default MinimalLayout;
