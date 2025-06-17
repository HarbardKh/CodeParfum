import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

export default function FamilleFougere() {
  return (
    <Layout title="Famille Olfactive Fougère | CodeParfum.fr">
      {/* Bannière stylisée avec fond dégradé */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-800/90 to-green-600/90 text-white">

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
              Famille Fougère
            </h1>
            <p className="text-xl md:text-2xl text-black leading-relaxed font-medium">
              L'élégance classique et intemporelle
            </p>
          </motion.div>
        </div>
        
        {/* Vague décorative en bas de la bannière */}
        <div className="absolute bottom-0 left-0 right-0 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
            <path fill="currentColor" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/familles-olfactives" className="inline-flex items-center text-green-700 hover:text-green-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour aux familles olfactives
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl shadow-sm mb-10"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Découvrez la famille fougère</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            La famille fougère est une création typiquement masculine, née avec le célèbre Fougère Royale de Houbigant en 1882. Elle ne sent pas la fougère au sens botanique, mais évoque la nature fraîche, verte, boisée et légèrement humide. C'est l'archétype du parfum masculin classique, mais revisité sans cesse depuis.
          </p>
                  </motion.div>
  
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {/* Notes typiques */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-serif mb-4">🌿 Notes typiques</h2>
              <p className="text-lg">Lavande, géranium, mousse de chêne, coumarine, bergamote, patchouli, vétiver</p>
            </div>

            {/* Pour qui */}
            <div>
              <h2 className="text-2xl font-serif mb-4">👤 Pour qui ?</h2>
              <p className="text-lg">
                Pour celles et ceux qui recherchent un parfum à la fois frais et structuré, naturel mais élégant. La fougère s'adresse aux esprits équilibrés, aux amateurs de parfums nets, sobres, qui donnent une impression de propreté et de raffinement tranquille.
              </p>
            </div>

            {/* Quand la porter */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-serif mb-4">⏰ Quand la porter ?</h2>
              <p className="text-lg">
                Parfait en toutes saisons. La fougère s'adapte facilement au bureau, aux rendez-vous ou aux journées actives. Fraîche en été, rassurante en hiver.
              </p>
            </div>

            {/* Sous-familles */}
            <div>
              <h2 className="text-2xl font-serif mb-6">🍃 Sous-familles fougères</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-2">Fougère aromatique</h3>
                  <p className="text-gray-700">(avec menthe, basilic, romarin)</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-2">Fougère ambrée</h3>
                  <p className="text-gray-700">(fond plus chaud, vanillé, oriental)</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-2">Fougère boisée</h3>
                  <p className="text-gray-700">(structure renforcée par du cèdre, du santal)</p>
                </div>
              </div>
            </div>

            {/* Ce que cette famille évoque */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-serif mb-4">💬 Ce que cette famille évoque</h2>
              <p className="text-lg">
                Un costume impeccable, un esprit méthodique, une élégance naturelle. Les fougères sont propres, rassurantes, et font partie de ces parfums qui donnent confiance sans trop en faire.
              </p>
            </div>

            {/* Le mot du parfumeur */}
            <div className="border-l-4 border-indigo-500 pl-6 py-2">
              <h2 className="text-2xl font-serif mb-4">🔍 Le mot du parfumeur</h2>
              <p className="text-lg italic">"La fougère est une colonne vertébrale. C'est la rigueur dans la fraîcheur, le parfum du gentleman contemporain."</p>
            </div>

            {/* CTA pour explorer les parfums */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl text-center mt-12">
              <h2 className="text-2xl font-serif mb-4">Découvrez nos parfums fougères</h2>
              <p className="text-lg mb-6">
                Explorez notre collection de parfums qui appartiennent à la famille fougère.
              </p>
              <Link href="/catalogue?famille=fougere" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Voir les parfums fougères
              </Link>
            </div>
          </div>

          {/* Autres familles olfactives */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif text-center mb-8">Explorer d'autres familles olfactives</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/familles-olfactives/florale" className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="p-4">
                    <h3 className="text-xl font-medium mb-2">Florale</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      Notes de rose, jasmin, fleur d'oranger...
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/familles-olfactives/boisee" className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="p-4">
                    <h3 className="text-xl font-medium mb-2">Boisée</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      Notes de cèdre, santal, vétiver, patchouli...
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/familles-olfactives/orientale" className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
                  <div className="p-4">
                    <h3 className="text-xl font-medium mb-2">Orientale</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      Notes de vanille, ambre, épices, résines...
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="text-center mt-8">
              <Link href="/guide-conseil/familles-olfactives" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Voir toutes les familles olfactives
              </Link>
            </div>
          </div>

          {/* Conseiller VIP CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-serif mb-4">Vous ne savez pas quelle famille olfactive vous correspond ?</h2>
            <p className="text-lg mb-6">
              Utilisez notre conseiller virtuel pour découvrir votre profil olfactif et recevoir des recommandations personnalisées.
            </p>
            <Link href="/conseiller-vip" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Essayer notre conseiller VIP
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 