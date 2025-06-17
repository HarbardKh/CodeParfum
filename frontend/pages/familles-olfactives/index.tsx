import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { FamilleOlfactive, getAllFamillesOlfactives, getDefaultFamillesOlfactives } from '@/services/familleOlfactiveService';

interface FamillesOlfactivesPageProps {
  familles: FamilleOlfactive[];
}

const FamillesOlfactivesPage = ({ familles }: FamillesOlfactivesPageProps) => {
  return (
    <Layout title="Familles Olfactives | CodeParfum.fr">
      <div>
        {/* En-tête */}
        <div className="relative bg-gradient-to-r from-primary-50 to-primary-100">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:py-10 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-primary-900 sm:text-5xl md:text-6xl lg:text-7xl font-serif relative">
                Les Familles Olfactives
                <span className="absolute -z-10 w-32 h-32 rounded-full bg-primary-100/50 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></span>
              </h1>
              <p className="mt-6 mx-auto text-xl text-primary-600">
                Comprendre les univers du parfum
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto pt-2 pb-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white shadow-lg rounded-lg p-6 my-8 text-gray-600"
          >
            <p className="lead text-lg">
              Lorsque l'on découvre un parfum, on ne sent pas seulement une odeur : on pénètre dans un univers. Une ambiance, une personnalité, une humeur. Pour aider chacun à mieux comprendre ce monde complexe, les parfumeurs ont défini ce qu'on appelle les familles olfactives.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white shadow-lg rounded-lg p-6 my-8 text-gray-600"
          >
            <h2 className="text-3xl font-serif font-bold text-primary-800 mt-0 mb-6 flex items-center">
              <span className="text-2xl mr-2">🌿</span> Qu'est-ce qu'une famille olfactive ?
            </h2>
            <p>
              C'est une manière de classer les parfums selon leurs notes dominantes. Chaque parfum est composé de plusieurs ingrédients (ce qu'on appelle des "notes") qui évoluent avec le temps. Mais généralement, une ou deux familles se distinguent pour donner le caractère principal du parfum.
            </p>
            <p>
              Comprendre les familles olfactives, c'est un peu comme connaître les grandes familles de vin ou les styles musicaux : cela vous aide à découvrir ce que vous aimez, à explorer, à choisir plus facilement, et à comprendre pourquoi un parfum vous touche ou vous laisse indifférent.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white shadow-lg rounded-lg p-6 my-8 text-gray-600"
          >
            <h2 className="text-3xl font-serif font-bold text-primary-800 mt-0 mb-6 flex items-center">
              <span className="text-2xl mr-2">🔍</span> Pourquoi cette classification est utile ?
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elle vous aide à choisir un parfum qui correspond à vos goûts.</li>
              <li>Elle permet de trouver des alternatives à votre parfum habituel.</li>
              <li>Elle facilite les comparaisons entre différentes marques.</li>
              <li>Elle sert de boussole olfactive dans un univers parfois trop vaste.</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-6 my-8 text-gray-600"
          >
            <h2 className="text-3xl font-serif font-bold text-primary-800 mt-0 mb-6 flex items-center">
              <span className="text-2xl mr-2">🌟</span> Les 7 grandes familles classiques
            </h2>
            <p>
              Voici les familles que vous croiserez le plus souvent en parfumerie, que ce soit chez les grandes marques, en boutique ou dans notre collection :
            </p>
          </motion.div>

          {/* Familles olfactives - Même design que la page d'accueil */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 w-full overflow-x-auto py-4"
          >
            <div className="flex flex-nowrap justify-start md:justify-center gap-x-3 pl-8 pr-4 md:pl-4 md:flex-wrap md:gap-3 min-w-full w-full">
              {/* La valeur pl-8 assure que le premier bouton est complètement visible sur mobile */}
              {[
                { name: 'Florale', href: '/familles-olfactives/florale', bgColor: 'bg-pink-600', hoverColor: 'hover:bg-pink-700', icon: '🌸' },
                { name: 'Boisée', href: '/familles-olfactives/boisee', bgColor: 'bg-emerald-600', hoverColor: 'hover:bg-emerald-700', icon: '🌳' },
                { name: 'Orientale', href: '/familles-olfactives/orientale', bgColor: 'bg-amber-600', hoverColor: 'hover:bg-amber-700', icon: '🔥' },
                { name: 'Hespéridée', href: '/familles-olfactives/hesperidee', bgColor: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600', icon: '🍊' },
                { name: 'Chyprée', href: '/familles-olfactives/chypree', bgColor: 'bg-purple-600', hoverColor: 'hover:bg-purple-700', icon: '🌼' },
                { name: 'Fougère', href: '/familles-olfactives/fougere', bgColor: 'bg-green-600', hoverColor: 'hover:bg-green-700', icon: '🌾' },
                { name: 'Aromatique', href: '/familles-olfactives/aromatique', bgColor: 'bg-teal-600', hoverColor: 'hover:bg-teal-700', icon: '🌿' },
              ].map((famille, index) => (
                <Link key={famille.name} href={famille.href} className={`flex-shrink-0 group relative rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 opacity-90 hover:opacity-100 transition-opacity`}>
                  <div className={`absolute inset-0 ${famille.bgColor} rounded-lg opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative z-10 p-4 text-center min-w-[140px]">
                    <span className="text-4xl mb-2 inline-block group-hover:scale-110 transition-transform">{famille.icon}</span>
                    <h3 className="text-lg font-semibold text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)]">{famille.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-6 my-8 text-gray-600"
          >
            <p className="mt-0">
              Chaque famille a son style, ses matières premières fétiches, ses amateurs, et même ses saisons idéales.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white shadow-lg rounded-lg p-6 my-8 text-gray-600"
          >
            <h2 className="text-3xl font-serif font-bold text-primary-800 mt-0 mb-6 flex items-center">
              <span className="text-2xl mr-2">💎</span> L'approche de CodeParfum.fr
            </h2>
            <p>
              Sur notre site, nous avons décidé de mettre en lumière ces familles pour vous aider à mieux choisir parmi notre catalogue. Ici, pas de jargon inutile, mais une explication claire, concise et inspirante. Chaque fiche que vous allez lire est une porte d'entrée vers un monde olfactif.
            </p>
            <p>
              Prenez le temps de les parcourir, de découvrir ce qui vous attire, de noter ce qui vous intrigue. Peut-être qu'une famille vous correspond sans que vous le sachiez encore... ou qu'il est temps de découvrir une nouvelle facette de votre personnalité parfumée.
            </p>
          </motion.div>

          <div className="mt-12 p-6 bg-primary-50 rounded-lg border border-primary-100 shadow-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-white shadow-lg rounded-lg p-6 my-8 text-gray-600"
            >
              <h3 className="text-xl font-semibold text-primary-900 mb-4 text-center mt-0">
                Découvrez votre famille olfactive préférée
              </h3>
              <p className="text-center italic text-primary-700">
                "La parfumerie est un art, et comme tout art, elle demande de la curiosité, de l'ouverture et une envie de se laisser surprendre."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Tentative de récupération des familles olfactives depuis l'API
    const familles = await getAllFamillesOlfactives();
    
    return {
      props: {
        familles
      },
      revalidate: 3600 // Revalidation toutes les heures
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des familles olfactives:', error);
    
    // En cas d'erreur, utiliser les familles par défaut
    return {
      props: {
        familles: getDefaultFamillesOlfactives()
      },
      revalidate: 60 // Revalidation plus fréquente en cas d'erreur
    };
  }
};

export default FamillesOlfactivesPage; 