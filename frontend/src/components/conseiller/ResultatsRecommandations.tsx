import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserResponses } from '@/types/conseil';
import { Recommendation } from '@/services/profilService';

interface ResultatsRecommandationsProps {
  userResponses: UserResponses;
  recommendations: Recommendation[];
  personalizedAdvice: string | null;
}

const ResultatsRecommandations: React.FC<ResultatsRecommandationsProps> = ({
  userResponses,
  recommendations,
  personalizedAdvice
}) => {
  // Récupérer la correspondance de parfum inspiré si disponible
  const inspirationMatch = recommendations.find(rec => rec.confiance >= 8); // On considère qu'un score de 8+ est élevé
  
  // Regrouper les recommandations par famille
  const recommendationsByFamily = recommendations.reduce((acc, rec) => {
    if (!rec.famille) return acc;
    
    const famille = rec.famille.split(' ')[0]; // Prendre juste le premier mot (Floral, Ambré, etc.)
    if (!acc[famille]) acc[famille] = [];
    acc[famille].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);
  
  // Regrouper par intensité
  const recommendationsByIntensity = recommendations.reduce((acc, rec) => {
    if (!rec.intensite) return acc;
    
    if (!acc[rec.intensite]) acc[rec.intensite] = [];
    acc[rec.intensite].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);
  
  // Regrouper par occasion
  const recommendationsByOccasion = recommendations.reduce((acc, rec) => {
    if (!rec.occasion || !Array.isArray(rec.occasion) || rec.occasion.length === 0) return acc;
    
    // Occasion est déjà un tableau, pas besoin de split
    rec.occasion.forEach(occasion => {
      if (!acc[occasion]) acc[occasion] = [];
      if (!acc[occasion].includes(rec)) { // Éviter les doublons
        acc[occasion].push(rec);
      }
    });
    
    return acc;
  }, {} as Record<string, Recommendation[]>);
  
  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-8 rounded-2xl shadow-lg border border-primary-100 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
          <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-semibold text-primary-800 mb-4">
          Votre profil olfactif a été créé !
        </h2>
        <p className="text-xl text-primary-700 mb-6">
          Merci {userResponses.prenom ? userResponses.prenom : 'cher client'} ! Nous avons analysé vos préférences et sélectionné des parfums parfaitement adaptés à votre profil.
        </p>
        {userResponses.consentement && (
          <p className="mt-2 text-base text-primary-600">
            Un email avec votre profil détaillé et des recommandations exclusives a été envoyé à <span className="font-medium">{userResponses.email}</span>.
          </p>
        )}
      </div>

      {/* Recommandation basée sur le parfum habituel du client */}
      {userResponses.parfumActuel && inspirationMatch && (
        <div className="bg-white p-8 rounded-xl shadow-md border border-primary-200">
          <h3 className="text-2xl font-serif font-medium text-primary-800 mb-6">
            Une fragrance qui pourrait vous séduire
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-primary-50 flex items-center justify-center text-5xl">
                ✨
              </div>
            </div>
            <div className="md:w-2/3">
              <h4 className="text-xl font-semibold text-primary-700 mb-2">Parfum n°{inspirationMatch.reference}</h4>
              <p className="text-gray-700 mb-4">
                D'après votre appréciation pour <span className="italic">{userResponses.parfumActuel}</span>, nous pensons que cette création pourrait vous offrir une expérience olfactive familière mais avec une touche unique et personnelle.
              </p>
              {inspirationMatch.a_propos ? (
                <p className="text-gray-700 mb-6">
                  {inspirationMatch.a_propos.substring(0, 200)}...
                </p>
              ) : (
                <p className="text-gray-700 mb-6">
                  Notre parfum n°{inspirationMatch.reference} partage certaines notes olfactives que vous appréciez déjà, tout en apportant sa propre signature distinctive. Une fragrance qui évoque des souvenirs agréables tout en créant de nouvelles émotions.
                </p>
              )}
              
              {inspirationMatch.pyramideOlfactive && (
                <div className="space-y-2 mb-4">
                  <p className="flex items-center text-gray-700">
                    <span className="w-6 flex-shrink-0">🌿</span>
                    <span className="ml-2">{inspirationMatch.famille}</span>
                  </p>
                  {inspirationMatch.pyramideOlfactive.notesDeTete && inspirationMatch.pyramideOlfactive.notesDeTete.length > 0 && (
                    <p className="flex items-center text-gray-700">
                      <span className="w-6 flex-shrink-0">👃</span>
                      <span className="ml-2">{inspirationMatch.pyramideOlfactive.notesDeTete.slice(0, 2).join(', ')}</span>
                    </p>
                  )}
                </div>
              )}
              
              <Link 
                href={`/catalogue/parfum/${inspirationMatch.reference}`} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                Découvrir ce parfum
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recommandations basées sur les préférences olfactives */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-serif font-medium text-primary-800">
            Selon vos préférences olfactives
          </h3>
          
          {/* Encart pour chaque famille olfactive aimée */}
          {Object.entries(recommendationsByFamily).map(([famille, recs]) => (
            <div key={`family-${famille}`} className="bg-white p-6 rounded-xl shadow-md border border-primary-100 mb-8">
              <h4 className="text-xl font-medium text-primary-700 mb-4">Votre attirance pour les notes {famille}...</h4>
              <p className="text-gray-700 mb-6">
                {famille === 'Floral' && 'Les parfums floraux révèlent votre côté romantique et sensible. Cette famille olfactive, à la fois douce et élégante, offre une palette riche d\'émotions.'}
                {famille === 'Ambré' && 'Votre intérêt pour les notes ambrées témoigne d\'une personnalité chaleureuse qui apprécie la profondeur et la sensualité dans un parfum.'}
                {famille === 'Boisé' && 'Les parfums boisés que vous appréciez reflètent un caractère naturel et authentique, avec une recherche d\'équilibre entre force et élégance.'}
                {famille === 'Fruité' && 'Votre goût pour les notes fruitées montre un tempérament joyeux et pétillant, qui aime apporter une touche de fraîcheur dans son sillage.'}
                {famille === 'Épicé' && 'En choisissant des parfums épicés, vous exprimez une personnalité audacieuse et passionnée, qui n\'hésite pas à affirmer son caractère.'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recs.slice(0, 3).map((rec, index) => (
                  <div key={`family-rec-${rec.id || rec.reference}-${index}`} className="bg-primary-50 rounded-xl overflow-hidden border border-primary-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl mr-4">
                          ✨
                        </div>
                        <h4 className="text-xl font-medium text-primary-800">Parfum n°{rec.reference}</h4>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 flex-shrink-0">🌿</span>
                          <span className="ml-2">{rec.famille || 'Famille variée'}</span>
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="w-6 flex-shrink-0">👃</span>
                          <span className="ml-2">{rec.notes || 'Notes diverses'}</span>
                        </p>
                      </div>
                      
                      <p className="text-primary-600 italic mb-6">
                        "{rec.description?.substring(0, 100)}..."
                      </p>
                      
                      <Link 
                        href={`/catalogue/parfum/${rec.reference}`} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Découvrir ce parfum
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conseil personnalisé avec un meilleur contraste */}
      {personalizedAdvice && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white p-8 rounded-2xl shadow-lg relative overflow-hidden border border-primary-200"
        >

          
          <div className="relative z-10">
            <h3 className="text-2xl font-serif mb-6 text-primary-800">Votre conseil personnalisé</h3>
            <div 
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: personalizedAdvice }}
            ></div>
          </div>
        </motion.div>
      )}

      {/* Éducation olfactive */}
      <div className="bg-primary-50 p-8 rounded-2xl shadow-md border border-primary-100">
        <h3 className="text-2xl font-serif font-medium text-primary-800 mb-6 text-center">Pour aller plus loin dans votre découverte olfactive</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/guide-conseil/familles-olfactives" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl mr-3 group-hover:bg-primary-200 transition-colors">
                🌿
              </div>
              <h4 className="text-xl font-medium text-primary-700">Les Familles Olfactives</h4>
            </div>
            <p className="text-gray-600">Approfondissez vos connaissances sur les différentes familles de parfums et leurs caractéristiques.</p>
          </Link>
          <Link href="/catalogue/best-sellers" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-xl mr-3 group-hover:bg-primary-200 transition-colors">
                ⭐
              </div>
              <h4 className="text-xl font-medium text-primary-700">Nos Best-Sellers</h4>
            </div>
            <p className="text-gray-600">Découvrez les parfums les plus populaires de notre collection et laissez-vous séduire par leurs notes.</p>
          </Link>
        </div>
      </div>

      <div className="text-center">
        <Link 
          href="/catalogue" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-700 hover:bg-primary-800 shadow-md"
        >
          Explorer tous nos parfums
          <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ResultatsRecommandations; 