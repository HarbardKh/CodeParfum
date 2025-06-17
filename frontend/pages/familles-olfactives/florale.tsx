import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { GetStaticProps } from 'next';
import { FamilleOlfactive, getFamilleOlfactiveBySlug } from '@/services/familleOlfactiveService';
import { Parfum, getParfumsByFamilleOlfactive } from '@/services/parfumService';

export const getStaticProps: GetStaticProps = async () => {
  const familleOlfactive = await getFamilleOlfactiveBySlug('florale');
  const parfums = await getParfumsByFamilleOlfactive('florale');

  return {
    props: {
      familleOlfactive,
      parfums,
    },
  };
};

interface Props {
  familleOlfactive: FamilleOlfactive;
  parfums: Parfum[];
}

const FamilleFlorale: React.FC<Props> = ({ familleOlfactive, parfums }) => {
  return (
    <Layout title="Famille Olfactive Florale | CodeParfum.fr">
      {/* Bannière stylisée avec fond dégradé */}
      <div className="relative overflow-hidden bg-gradient-to-r from-pink-700/90 to-purple-600/90 text-white">
        <div className="absolute inset-0 z-0 opacity-20" style={{ 
          background: "linear-gradient(135deg, rgba(216, 180, 254, 0.3), rgba(129, 140, 248, 0.3))",
          backgroundSize: "cover",
        }}></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">
              Famille Florale
            </h1>
            <p className="text-xl md:text-2xl text-black leading-relaxed font-medium">
              L'élégance naturelle et la grâce en parfumerie
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
          <Link href="/familles-olfactives" className="inline-flex items-center text-pink-700 hover:text-pink-900 transition-colors">
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
            className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 md:p-10 rounded-xl mb-12 shadow-sm border border-pink-100"
          >
            <h2 className="text-3xl font-serif text-pink-900 mb-6">La poésie des fleurs</h2>
            <p className="text-lg leading-relaxed text-pink-950">
              La famille florale célèbre la délicatesse et la richesse des fleurs. Elle représente la plus vaste et la plus ancienne famille de la parfumerie. Elle évoque la féminité, l'élégance et la fraîcheur naturelle.
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Notes typiques */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-pink-100"
            >
              <div className="flex items-start">
                <div className="bg-pink-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">🖊️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-pink-900">Notes typiques</h2>
                  <p className="text-lg text-gray-700">Rose, jasmin, tubéreuse, fleur d'oranger, pivoine, muguet, violette, lilas</p>
                </div>
              </div>
            </motion.div>

            {/* Pour qui */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-xl bg-gradient-to-br from-pink-50 to-white"
            >
              <div className="flex items-start">
                <div className="bg-pink-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">👩</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-pink-900">Pour qui ?</h2>
                  <p className="text-lg text-gray-700">
                    Historiquement féminine, cette famille séduit aujourd'hui aussi les hommes dans des compositions plus modernes. Elle plaît aux amateurs d'élégance discrète, d'intemporalité et de fraîcheur sophistiquée.
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
              className="bg-white p-8 rounded-xl shadow-sm border border-pink-100"
            >
              <div className="flex items-start">
                <div className="bg-pink-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">🕒</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-pink-900">Quand la porter ?</h2>
                  <p className="text-lg text-gray-700">
                    Les floraux légers sont parfaits pour le printemps et l'été, tandis que les floraux plus riches et crémeux conviennent à l'automne. Ils s'adaptent aux occasions formelles comme décontractées.
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
              <h2 className="text-2xl font-serif mb-6 text-pink-900 flex items-center">
                <span className="bg-pink-100 rounded-full p-2 mr-4">
                  <span className="text-2xl">🌸</span>
                </span>
                Sous-familles florales
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-pink-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-pink-800">Floraux frais</h3>
                    <p className="text-gray-600">Notes de muguet, freesia, gardénia</p>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-pink-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-pink-800">Floraux verts</h3>
                    <p className="text-gray-600">Notes de lierre, feuilles vertes, galbanum</p>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-pink-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-pink-800">Floraux poudrés</h3>
                    <p className="text-gray-600">Notes d'iris, héliotrope, mimosa</p>
                  </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-pink-50">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-3 text-pink-800">Floraux opulents</h3>
                    <p className="text-gray-600">Notes de tubéreuse, jasmin, ylang-ylang</p>
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
              className="bg-white p-8 rounded-xl shadow-sm border border-pink-100"
            >
              <div className="flex items-start">
                <div className="bg-pink-100 rounded-full p-3 mr-6">
                  <span className="text-3xl">💬</span>
                </div>
                <div>
                  <h2 className="text-2xl font-serif mb-4 text-pink-900">Ce que cette famille évoque</h2>
                  <p className="text-lg text-gray-700">
                    Un jardin printanier en pleine floraison, l'élégance d'un bouquet fraîchement cueilli, la délicatesse d'un pétale de rose. Les floraux sont romantiques, intemporels et poétiques.
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
              className="bg-gradient-to-r from-pink-700 to-purple-600 text-white p-8 rounded-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 z-0 opacity-10" style={{ 
                background: "linear-gradient(135deg, rgba(190, 24, 93, 0.2), rgba(126, 34, 206, 0.2))",
                backgroundSize: "cover",
              }}></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-serif mb-4 flex items-center">
                  <span className="text-3xl mr-3">🔎</span>
                  Le mot du parfumeur
                </h2>
                <p className="text-xl italic font-serif">
                  "Les fleurs sont l'âme de la parfumerie. Chacune a sa personnalité : la rose est noble, le jasmin est sensuel, la tubéreuse est envoûtante. Elles nous offrent un spectre émotionnel incroyablement riche."
                </p>
              </div>
            </motion.div>

            {/* CTA pour explorer les parfums */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-xl text-center my-12 shadow-md border border-pink-200"
            >
              <div className="mx-auto">
                <h2 className="text-3xl font-serif mb-4 text-pink-900">Découvrez nos parfums floraux</h2>
                <p className="text-lg mb-8 text-pink-800">
                  Explorez notre collection de parfums qui célèbrent la beauté et la diversité des fleurs, pour une signature olfactive à la fois élégante et naturelle.
                </p>
                <Link href="/catalogue?famille=florale" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-pink-700 hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300">
                  Voir les parfums floraux
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
            <h2 className="text-3xl font-serif text-center mb-12 text-pink-900">Explorer d'autres familles olfactives</h2>
            <div className="grid md:grid-cols-3 gap-8">
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
              <Link href="/guide-conseil/familles-olfactives" className="inline-flex items-center px-6 py-3 border border-pink-300 shadow-sm text-base font-medium rounded-md text-pink-800 bg-white hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300">
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
            <div className="absolute inset-0 opacity-10" style={{ 
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(79, 70, 229, 0.15))",
              backgroundSize: "cover",
            }}></div>
            <div className="relative z-10 text-center p-12">
              <h2 className="text-3xl font-serif mb-6 text-white">Quelle famille olfactive vous correspond ?</h2>
              <p className="text-xl mb-8 text-purple-100 mx-auto">
                Utilisez notre conseiller virtuel pour découvrir votre profil olfactif et recevoir des recommandations personnalisées adaptées à vos goûts et à votre personnalité.
              </p>
              <Link href="/conseillerVIP" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300">
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

export default FamilleFlorale;
