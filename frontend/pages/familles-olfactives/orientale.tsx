import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

export default function FamilleOrientale() {
  return (
    <Layout title="Famille Olfactive Orientale | CodeParfum.fr">
      {/* Bannière stylisée avec fond dégradé */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-800/90 to-amber-700/90 text-white">

        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
              Famille Orientale
            </h1>
            <p className="text-xl md:text-2xl text-black leading-relaxed font-medium">
              L'appel au voyage des sens
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
          <Link href="/familles-olfactives" className="inline-flex items-center text-amber-700 hover:text-amber-900 transition-colors">
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
            className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 md:p-10 rounded-xl mb-12 shadow-sm border border-amber-100"
          >
            <h2 className="text-3xl font-serif text-amber-900 mb-6">L'essence d'Orient</h2>
            <p className="text-lg leading-relaxed text-amber-950">
              La famille orientale est un appel au voyage. Inspirée des rituels de beauté ancestraux, des matières précieuses d'Orient, des encens, baumes et résines sacrées, elle exprime la chaleur, la sensualité, l'intensité et le mystère.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Notes typiques */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-amber-100"
            >
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">🔥</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-amber-900">Notes typiques</h2>
                  <p className="text-lg text-gray-700">Vanille, ambre, fève tonka, encens, patchouli, musc, myrrhe, ciste-labdanum</p>
                </div>
              </div>
            </motion.div>

            {/* Pour qui */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-xl bg-gradient-to-br from-amber-50 to-white"
            >
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">👤</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-amber-900">Pour qui ?</h2>
                  <p className="text-lg text-gray-700">
                    Pour les amateurs de parfums charnels, enveloppants, qui marquent les esprits. Les orientaux attirent les personnalités affirmées, romantiques ou séductrices, mais aussi les rêveurs. Ce sont des parfums de peau, de présence, de passion.
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
              className="bg-white p-8 rounded-xl shadow-sm border border-amber-100"
            >
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">🕒</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-amber-900">Quand la porter ?</h2>
                  <p className="text-lg text-gray-700">
                    Parfait en automne et hiver, le soir, ou pour des occasions spéciales. On évite en été sauf version légère. Ils sont idéaux pour se sentir enveloppé, rassuré, ou pour séduire discrètement mais sûrement.
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
              <h2 className="text-2xl font-serif mb-6 text-amber-900 flex items-center">
                <span className="bg-amber-100 rounded-full p-2 mr-4">
                  <span className="text-2xl">🕌</span>
                </span>
                Sous-familles orientales
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-amber-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-amber-800">Oriental épicé</h3>
                    <p className="text-gray-600">Notes de cannelle, poivre, cardamome</p>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-amber-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-amber-800">Oriental floral</h3>
                    <p className="text-gray-600">Notes de jasmin, tubéreuse, fleur d'oranger</p>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-amber-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-amber-800">Oriental boisé</h3>
                    <p className="text-gray-600">Notes d'oud, cèdre, bois de santal</p>
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
              className="bg-white p-8 rounded-xl shadow-sm border border-amber-100"
            >
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">💬</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-amber-900">Ce que cette famille évoque</h2>
                  <p className="text-lg text-gray-700">
                    Un palais de soie, une nuit étoilée dans le désert, une peau nue caressée par la chaleur. Ce sont des parfums qui font voyager, qui enrobent et hypnotisent.
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
              className="bg-gradient-to-r from-amber-800 to-amber-700 text-white p-8 rounded-xl relative overflow-hidden"
            >

              <div className="relative z-10">
                <h2 className="text-2xl font-serif mb-4 flex items-center">
                  <span className="text-3xl mr-3">✒️</span>
                  Le mot du parfumeur
                </h2>
                <p className="text-xl italic font-serif">
                  "Les orientaux sont une étreinte. Ils racontent une histoire intime, sensuelle, enveloppante. C'est le parfum du souvenir et de l'émotion."
                </p>
              </div>
            </motion.div>

            {/* CTA pour explorer les parfums */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-xl text-center my-12 shadow-md border border-amber-200"
            >
              <div className="mx-auto">
                <h2 className="text-3xl font-serif mb-4 text-amber-900">Découvrez nos parfums orientaux</h2>
                <p className="text-lg mb-8 text-amber-800">
                  Explorez notre collection de parfums qui appartiennent à la famille orientale et trouvez celui qui vous transportera dans un voyage sensoriel unique.
                </p>
                <Link href="/catalogue?famille=orientale" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300">
                  Voir les parfums orientaux
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
            <h2 className="text-3xl font-serif text-center mb-12 text-amber-900">Explorer d'autres familles olfactives</h2>
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
              <Link href="/familles-olfactives/boisee" className="block group">
                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 border border-emerald-100">
                  <div className="p-6">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <span className="text-3xl">🌳</span>
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-emerald-800">Boisée</h3>
                    <p className="text-gray-600">
                      Notes de cèdre, santal, vétiver, patchouli...
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
              <Link href="/guide-conseil/familles-olfactives" className="inline-flex items-center px-6 py-3 border border-amber-300 shadow-sm text-base font-medium rounded-md text-amber-800 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300">
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