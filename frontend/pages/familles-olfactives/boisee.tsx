import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

export default function FamilleBoisee() {
  return (
    <Layout title="Famille Olfactive Boisée | CodeParfum.fr">
      {/* Bannière stylisée avec fond dégradé */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800/90 to-emerald-700/90 text-white">

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
              Famille Boisée
            </h1>
            <p className="text-xl md:text-2xl text-black leading-relaxed font-medium">
              Force tranquille et profondeur de la nature
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
          <Link href="/familles-olfactives" className="inline-flex items-center text-emerald-700 hover:text-emerald-900 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour aux familles olfactives
          </Link>
                  </div>
  
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 md:p-10 rounded-xl mb-12 shadow-sm border border-emerald-100"
          >
            <h2 className="text-3xl font-serif text-emerald-900 mb-6">L'essence de la forêt</h2>
            <p className="text-lg leading-relaxed text-emerald-950">
              La famille boisée évoque la force tranquille, l'assurance naturelle, la profondeur de la terre et des forêts. Longtemps considérée comme masculine, elle est aujourd'hui adoptée dans de nombreuses créations mixtes voire féminines.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Notes typiques */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-emerald-100"
            >
              <div className="flex items-start">
                <div className="bg-emerald-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">🖊️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-emerald-900">Notes typiques</h2>
                  <p className="text-lg text-gray-700">Cèdre, santal, vétiver, patchouli, bois de gaïac, mousse de chêne, oud</p>
                </div>
              </div>
            </motion.div>

            {/* Pour qui */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-xl bg-gradient-to-br from-emerald-50 to-white"
            >
              <div className="flex items-start">
                <div className="bg-emerald-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">🤵️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-emerald-900">Pour qui ?</h2>
                  <p className="text-lg text-gray-700">
                    Les amateurs d'élégance sobre, de parfums à la fois chaleureux et racés. Elle attire les esprits posés, profonds et sûrs d'eux, mais aussi ceux qui cherchent une signature enveloppante, durable, presque méditative.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quand la porter */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-emerald-100"
            >
              <div className="flex items-start">
                <div className="bg-emerald-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">🕒</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-emerald-900">Quand la porter ?</h2>
                  <p className="text-lg text-gray-700">
                    Idéale en automne et hiver, ou en soirée. Certaines facettes plus fraîches (vétiver, bois aquatiques) fonctionnent bien au printemps.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sous-familles */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-serif mb-6 text-emerald-900 flex items-center">
                <span className="bg-emerald-100 rounded-full p-2 mr-4">
                  <span className="text-2xl">🌳</span>
                </span>
                Sous-familles boisées
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-emerald-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-emerald-800">Boisé épicé</h3>
                    <p className="text-gray-600">Notes de poivre, cannelle</p>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-emerald-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-emerald-800">Boisé floral musqué</h3>
                    <p className="text-gray-600">Notes d'iris, musc blanc</p>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-emerald-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-emerald-800">Boisé aquatique</h3>
                    <p className="text-gray-600">Notes ozoniques, fraîcheur, bois clair</p>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-emerald-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-emerald-800">Boisé chypré</h3>
                    <p className="text-gray-600">Notes de mousse de chêne, bergamote</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Ce que cette famille évoque */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-emerald-100"
            >
              <div className="flex items-start">
                <div className="bg-emerald-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">💬</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-emerald-900">Ce que cette famille évoque</h2>
                  <p className="text-lg text-gray-700">
                    Un feu de bois en hiver, une forêt de pins après la pluie, un meuble ancien poli par le temps. Les boisés sont profonds, nobles et intemporels.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Le mot du parfumeur */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-8 rounded-xl relative overflow-hidden"
            >

              <div className="relative z-10">
                <h2 className="text-2xl font-serif mb-4 flex items-center">
                  <span className="text-3xl mr-3">🔎</span>
                  Le mot du parfumeur
                </h2>
                <p className="text-xl italic font-serif">
                  "Les bois sont la colonne vertébrale de nombreuses compositions : ils apportent structure, tenue et personnalité. Une touche boisée, c'est un socle. Un ancrage."
                </p>
              </div>
            </motion.div>

            {/* CTA pour explorer les parfums */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-xl text-center my-12 shadow-md border border-emerald-200"
            >
              <div className="mx-auto">
                <h2 className="text-3xl font-serif mb-4 text-emerald-900">Découvrez nos parfums boisés</h2>
                <p className="text-lg mb-8 text-emerald-800">
                  Explorez notre collection de parfums qui appartiennent à la famille boisée et trouvez celui qui vous transportera au cœur des forêts.
                </p>
                <Link href="/catalogue?famille=boisee" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300">
                  Voir les parfums boisés
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Section des autres familles */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24"
          >
            <h2 className="text-3xl font-serif text-center mb-12 text-emerald-900">Explorer d'autres familles olfactives</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Link href="/familles-olfactives/florale" className="block group">
                <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-pink-100">
                  <div className="p-6">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                      <span className="text-3xl">🌸</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-pink-800">Florale</h3>
                    <p className="text-gray-600">
                      Notes de rose, jasmin, fleur d'oranger...
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/familles-olfactives/orientale" className="block group">
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-amber-100">
                  <div className="p-6">
                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                      <span className="text-3xl">🕌</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-amber-800">Orientale</h3>
                    <p className="text-gray-600">
                      Notes de vanille, ambre, épices, résines...
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/familles-olfactives/hesperidee" className="block group">
                <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-yellow-100">
                  <div className="p-6">
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                      <span className="text-3xl">🍊</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-yellow-800">Hespéridée</h3>
                    <p className="text-gray-600">
                      Notes d'agrumes: citron, bergamote, mandarine...
                    </p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="text-center mt-10">
              <Link href="/guide-conseil/familles-olfactives" className="inline-flex items-center px-6 py-3 border border-emerald-300 shadow-sm text-base font-medium rounded-md text-emerald-800 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300">
                Voir toutes les familles olfactives
              </Link>
            </div>
          </motion.div>

          {/* Conseiller VIP CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-32 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 rounded-2xl"></div>

            <div className="relative z-10 text-center p-12">
              <h2 className="text-3xl font-serif mb-6 text-white">Quelle famille olfactive vous correspond ?</h2>
              <p className="text-xl mb-8 text-purple-100 mx-auto">
                Utilisez notre conseiller virtuel pour découvrir votre profil olfactif et recevoir des recommandations personnalisées adaptées à vos goûts et à votre personnalité.
              </p>
              <Link href="/conseiller-vip" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300">
                Essayer notre conseiller VIP
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 