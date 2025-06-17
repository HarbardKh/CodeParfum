import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function Custom404() {
  return (
    <Layout title="Page Non Trouvée - CodeParfum.fr">
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            404
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 