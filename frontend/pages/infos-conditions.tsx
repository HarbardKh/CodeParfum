import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';

export default function InfosConditions() {
  return (
    <Layout title="Informations légales & Conditions - CodeParfum.fr">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-serif font-bold text-[#8A1538] mb-6 text-center">
            Informations légales & Conditions
          </h1>
        </motion.div>

        {/* Section Mentions Légales */}
        <motion.section 
          id="mentions-legales" 
          className="mb-16 mt-12 bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-3xl font-serif font-bold text-[#8A1538] mb-6 text-center">Mentions légales</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Informations sur la société</h3>
              <div className="bg-[#f8f5f5] p-5 rounded-lg">
                <p className="font-medium">CodeParfum.fr – Entreprise individuelle (micro-entrepreneur)</p>
                <p>SIRET : [à compléter]</p>
                <p>Siège social : [à compléter – adresse personnelle ou administrative]</p>
                <p>Email : contact@atelierolfactifprive.fr</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Directeur de la publication</h3>
              <p className="text-gray-700">[Nom du responsable légal]</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Hébergeur du site</h3>
              <div className="bg-[#f8f5f5] p-5 rounded-lg">
                <p className="font-medium">À compléter une fois le prestataire défini</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Propriété intellectuelle</h3>
              <p className="text-gray-700">
                L'ensemble du contenu de ce site (textes, images, vidéos, etc.) est la propriété exclusive de CodeParfum.fr ou de tiers ayant autorisé son utilisation. Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou partie des éléments du site est strictement interdite sans autorisation écrite préalable.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section Politique de Confidentialité */}
        <motion.section 
          id="confidentialite" 
          className="mb-16 bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-serif font-bold text-[#8A1538] mb-6 text-center">Politique de confidentialité</h2>
          
          <div className="space-y-8">
            <div>
              <p className="text-gray-700">
                CodeParfum.fr collecte et traite les données personnelles dans le respect du RGPD (Règlement Général sur la Protection des Données) et de la loi française.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Données collectées</h3>
              <p className="text-gray-700 mb-2">Les données collectées sont :</p>
              <ul className="list-disc pl-6 text-gray-700">
                <li>Nom, prénom</li>
                <li>Adresse postale</li>
                <li>E-mail</li>
                <li>Téléphone</li>
                <li>Historique de commande</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Durée de conservation</h3>
              <p className="text-gray-700">
                Conservation : jusqu'à 10 ans à des fins de preuve commerciale.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Cookies</h3>
              <p className="text-gray-700">
                Cookies : utilisés à des fins d'analyse ; configurables via votre navigateur.
              </p>
              <p className="text-gray-700 mt-2 italic">
                Conforme RGPD 2025 – prévoir une bannière cookies pour validation CNIL.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Section CGV */}
        <motion.section 
          id="cgv" 
          className="mb-16 bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-serif font-bold text-[#8A1538] mb-6 text-center">Conditions Générales de Vente</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Préambule</h3>
              <p className="text-gray-700">
                Les présentes CGV s'appliquent à toutes les ventes conclues sur le site. Toute commande implique l'acceptation des présentes conditions.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Produits</h3>
              <p className="text-gray-700">
                Descriptions détaillées sur les fiches produit. Visuels non contractuels.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Prix</h3>
              <p className="text-gray-700">
                TTC, en euros. Hors frais de livraison.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Paiement</h3>
              <p className="text-gray-700">
                Carte bancaire (Visa, Mastercard), PayPal (1ère commande obligatoire), virement bancaire.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Livraison</h3>
              <p className="text-gray-700">
                Délai estimé entre 7 et 10 jours ouvrés.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Rétractation</h3>
              <p className="text-gray-700">
                14 jours dès réception. Frais de retour à la charge de l'acheteur.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Garanties</h3>
              <p className="text-gray-700">
                Conformité légale et garantie contre vices cachés.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-[#8A1538] mb-4">Litiges</h3>
              <p className="text-gray-700">
                Solution amiable recherchée. Tribunal compétent selon lieu de livraison ou domicile acheteur.
              </p>
            </div>
          </div>
        </motion.section>
      </main>
    </Layout>
  );
}
