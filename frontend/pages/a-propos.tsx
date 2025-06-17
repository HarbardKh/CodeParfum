import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

// Animation pour les sections
interface SectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}

const Section = ({ children, delay = 0, className, id }: SectionProps) => (
  <motion.div
    id={id}
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
);

export default function About() {
  return (
    <Layout title="À Propos - CodeParfum.fr">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        {/* En-tête de page */}
        <div className="mb-12">
          <Section>
            <h1 className="text-4xl font-serif font-bold tracking-tight text-primary-900 mb-6 text-center">
              À Propos
            </h1>
            <p className="text-lg text-primary-600 italic text-center max-w-3xl mx-auto">
              Découvrez notre histoire, nos valeurs et nos engagements
            </p>
          </Section>
        </div>

        {/* Section: Notre Histoire */}
        <Section className="mb-20" id="notre-histoire" delay={0.1}>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-4xl font-serif font-bold text-[#8A1538] mb-4 text-center">Notre Histoire</h2>
            <p className="text-lg text-gray-600 text-center mb-8">L'envie de partager un bon plan, né d'un besoin réel</p>
            
            <div className="space-y-6 text-gray-700 max-w-4xl mx-auto">
              <p>
                Pendant longtemps, j'ai trouvé les parfums beaucoup trop chers pour ce qu'ils sont. À mes yeux, le prix ne reflétait pas toujours la qualité, mais plutôt une image, un logo, un marketing bien rodé.
              </p>
              <p>
                Quand j'ai découvert les parfums Chogan, j'ai compris qu'il était possible d'avoir des fragrances de grande qualité sans exploser son budget. C'était un bon plan, et je voulais le partager. C'est ainsi qu'est né CodeParfum.fr : un projet simple, pensé pour celles et ceux qui veulent se faire plaisir sans tomber dans les pièges du luxe hors de prix.
              </p>
            </div>
          </div>
        </Section>
        
        {/* Section: L'histoire de Chogan */}
        <Section className="mb-20" id="histoire-chogan" delay={0.2}>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-4xl font-serif font-bold text-[#8A1538] mb-4 text-center">L'histoire de Chogan</h2>
            <p className="text-lg text-gray-600 text-center mb-8">Une marque italienne d'excellence dans le monde de la parfumerie</p>
            
            <div className="space-y-6 text-gray-700 max-w-4xl mx-auto">
              <p>
                Née en Italie, Chogan s'est rapidement imposée comme un acteur majeur de la parfumerie accessible. Sa mission ? Offrir des fragrances d'exception inspirées des grandes maisons, tout en conservant une qualité olfactive irréprochable à un prix juste.
              </p>
              
              <p>
                Loin des codes élitistes du luxe traditionnel, Chogan démocratise l'excellence olfactive grâce à un système de commercialisation innovant et indépendant. En s'appuyant sur un modèle de vente directe, sans intermédiaires coûteux ni campagnes marketing démesurées, la marque réalise des économies substantielles qui se répercutent directement sur le prix final.
              </p>
              
              <p>
                Résultat : des parfums de très haute qualité, proposés à des prix justes et accessibles, pour toutes celles et ceux qui refusent de payer le marketing d'un logo.
              </p>
            </div>
            
            {/* Cartes des valeurs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium text-[#8A1538] mb-4 text-center">Qualité Premium</h3>
                <p className="text-gray-600 text-center">
                  Des ingrédients rigoureusement sélectionnés, des compositions soignées, et un contrôle qualité à chaque étape.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium text-[#8A1538] mb-4 text-center">Savoir-faire Italien</h3>
                <p className="text-gray-600 text-center">
                  Une maison née de la tradition italienne, mêlant héritage olfactif et modernité dans chaque fragrance.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium text-[#8A1538] mb-4 text-center">Accessibilité</h3>
                <p className="text-gray-600 text-center">
                  Des parfums inspirés des plus grandes maisons, rendus accessibles grâce à un modèle de distribution directe et responsable.
                </p>
              </div>
            </div>
          </div>
        </Section>
        
        {/* Section: Notre Engagement */}
        <Section className="mb-20" id="notre-engagement" delay={0.3}>
          <div className="bg-[#FFF8FB] p-8 rounded-xl shadow-sm">
            <h2 className="text-4xl font-serif font-bold text-[#8A1538] mb-4 text-center">Notre Engagement</h2>
            <p className="text-lg text-gray-600 text-center mb-12">La satisfaction de nos clients est notre priorité absolue</p>
            
            <div className="space-y-6 text-gray-700 max-w-4xl mx-auto">
              <p>
                Chez CodeParfum.fr, nous avons à cœur de défendre un accès plus juste au parfum de qualité. En collaboration directe avec Chogan, nous nous engageons à proposer des fragrances haut de gamme à des prix honnêtes, en toute transparence.
              </p>
              <p>
                Notre mission est simple : diffuser un bon plan trop peu connu, en valorisant une alternative crédible et qualitative face aux grands noms du marché. Ensemble — la maison Chogan, notre plateforme, et moi-même — nous portons une vision partagée : celle d'un parfum accessible, élégant, et respectueux de celles et ceux qui le portent.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium text-[#8A1538] mb-6 text-center">Qualité Garantie</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#D88FA9] mr-2">✓</span>
                    <span>Tests rigoureux de qualité</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#D88FA9] mr-2">✓</span>
                    <span>Ingrédients sélectionnés avec soin</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#D88FA9] mr-2">✓</span>
                    <span>Contrôles réguliers</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium text-[#8A1538] mb-6 text-center">Service Client</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-[#D88FA9] mr-2">✓</span>
                    <span>Conseils personnalisés</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#D88FA9] mr-2">✓</span>
                    <span>Réponse rapide à vos questions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#D88FA9] mr-2">✓</span>
                    <span>Satisfaction garantie</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Section>
        
        {/* Note de conclusion */}
        <Section delay={0.4} className="mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h2 className="text-2xl font-serif font-bold text-[#8A1538] mb-4">Découvrez l'univers Chogan</h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              Nous vous invitons à explorer notre collection de parfums d'exception et à découvrir
              l'excellence olfactive italienne à travers nos créations soigneusement sélectionnées.
            </p>
            <Link href="/parfums" className="inline-block px-6 py-3 bg-[#8A1538] text-white rounded-lg hover:bg-[#731230] transition-colors">
              Découvrir nos parfums
            </Link>
          </div>
        </Section>
      </div>
    </Layout>
  );
}
