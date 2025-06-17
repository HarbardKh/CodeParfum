import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function ServiceClient() {
  return (
    <Layout title="Service Client - CodeParfum.fr">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-primary-900 mb-6 text-center">
          Service Client
        </h1>
        
        {/* Section Contact */}
        <section id="contact" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-medium text-primary-800 mb-4">Contact</h2>
          <p className="text-gray-600 mb-6">
            Pour toute question concernant nos produits ou votre commande, vous pouvez nous écrire à <strong>contact@atelierolfactifprive.fr</strong> ou simplement utiliser le formulaire ci-dessous. Nous sommes là pour vous répondre rapidement et avec transparence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-medium text-primary-700 mb-2">Nous contacter</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>contact@atelierolfactifprive.fr</span>
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>01 23 45 67 89</span>
                </li>
              </ul>
              <p className="mt-3 text-sm text-gray-500">Nous répondons sous 24h ouvrées</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-medium text-primary-700 mb-2">Horaires d'ouverture</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span>9h00 - 18h00</span>
                </li>
                <li className="flex justify-between">
                  <span>Samedi</span>
                  <span>10h00 - 17h00</span>
                </li>
                <li className="flex justify-between">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Formulaire de contact intégré dans la section contact */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-primary-700 mb-4">Formulaire de contact</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" name="nom" id="nom" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea name="message" id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </section>
        
        {/* Section Livraison */}
        <section id="livraison" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-medium text-primary-800 mb-4">Livraison</h2>
          <p className="text-gray-600 mb-6">
            Nos commandes sont traitées sous 24 à 48h ouvrées. La livraison est effectuée en 7 à 10 jours ouvrés. Pour plus d'informations, consultez nos <Link href="/infos-conditions" className="text-primary-600 hover:underline">conditions générales de vente</Link>.
          </p>
          <ul className="space-y-2 text-gray-600 list-disc pl-6">
            <li><strong>Délais de livraison :</strong> 7–10 jours ouvrés</li>
            <li><strong>Frais de livraison :</strong> Offerts dès 50€ d'achat</li>
            <li><strong>Suivi de commande :</strong> Un email de confirmation vous sera envoyé après l'expédition de votre colis, contenant un numéro de suivi vous permettant de suivre votre livraison en temps réel.</li>
          </ul>
        </section>
        
        {/* Section Suivi de commande */}
        <section id="suivi-commande" className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-medium text-primary-800 mb-4">Suivi de commande</h2>
          <p className="text-gray-600 mb-6">
            Un email de confirmation vous sera envoyé après validation de votre commande, contenant un numéro de suivi qui vous permettra de suivre votre colis.
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-gray-600">
            <li>Connectez-vous à votre compte client</li>
            <li>Accédez à la rubrique "Mes commandes"</li>
            <li>Cliquez sur la commande dont vous souhaitez suivre la progression</li>
            <li>Cliquez sur le numéro de suivi pour être redirigé vers le site du transporteur</li>
          </ol>
        </section>
        
        {/* Section FAQ */}
        <section id="faq" className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium text-primary-800 mb-4">FAQ</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-primary-700 mb-2">Comment choisir mon parfum ?</h3>
              <p className="text-gray-600">
                Nous proposons une sélection de parfums de haute qualité pour homme et femme. Consultez notre catalogue pour découvrir nos différentes fragrances et leurs notes olfactives.
                Pour un accompagnement personnalisé, notre <Link href="/conseillerVIP" className="text-primary-600 hover:underline">Conseiller VIP</Link> est également disponible sur le site pour vous guider dans votre choix.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-primary-700 mb-2">Quels sont les moyens de paiement acceptés ?</h3>
              <p className="text-gray-600">
                Nous acceptons les paiements par carte bancaire (Visa, Mastercard), PayPal (obligatoire pour la première commande), et virement bancaire.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-primary-700 mb-2">Quel est le délai de rétractation ?</h3>
              <p className="text-gray-600">
                Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours à compter de la réception de votre commande pour exercer votre droit de rétractation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-primary-700 mb-2">Comment retourner un produit ?</h3>
              <p className="text-gray-600">
                Si vous souhaitez retourner un produit, veuillez nous contacter par email à returns@atelierolfactifprive.fr en indiquant votre numéro de commande. Nous vous indiquerons la marche à suivre pour effectuer votre retour.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
} 