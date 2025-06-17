import Layout from '@/components/layout/Layout';
import Link from 'next/link';

export default function PolitiqueCookies() {
  return (
    <Layout title="Politique de Cookies - CodeParfum.fr">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-primary-900 mb-8 text-center">
          Politique de Cookies
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 prose prose-primary max-w-none">
          <p className="text-sm text-gray-500 mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou téléphone 
              mobile) lors de la visite d'un site web. Il permet au site de mémoriser vos actions et préférences 
              (identifiant de connexion, langue, taille des caractères et autres paramètres d'affichage) pendant 
              une période déterminée, pour que vous n'ayez pas à les indiquer à chaque fois que vous revenez sur 
              le site ou que vous naviguez d'une page à une autre.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">2. Comment utilisons-nous les cookies ?</h2>
            <p>
              Notre site CodeParfum.fr utilise différents types de cookies pour améliorer l'interactivité 
              du site et nos services :
            </p>
            
            <h3 className="text-lg font-medium text-primary-700 mt-6 mb-3">2.1 Cookies strictement nécessaires</h3>
            <p>
              Ces cookies sont indispensables au fonctionnement de notre site. Ils vous permettent d'utiliser les 
              principales fonctionnalités de notre site (par exemple l'accès à votre compte ou à votre panier d'achat). 
              Sans ces cookies, vous ne pourrez pas utiliser notre site normalement.
            </p>
            
            <h3 className="text-lg font-medium text-primary-700 mt-6 mb-3">2.2 Cookies fonctionnels</h3>
            <p>
              Ces cookies permettent de mémoriser vos préférences, vos choix afin de personnaliser votre expérience 
              sur notre site.
            </p>
            
            <h3 className="text-lg font-medium text-primary-700 mt-6 mb-3">2.3 Cookies analytiques ou de performance</h3>
            <p>
              Ces cookies collectent des informations sur votre navigation (pages visitées, temps passé sur le site, 
              problèmes rencontrés, etc.) afin d'améliorer la performance et la conception de notre site. Ils nous 
              aident à comprendre comment vous interagissez avec le site, à mesurer l'efficacité de nos campagnes et 
              à optimiser notre site pour les visiteurs.
            </p>
            <p>
              Nous utilisons pour cela Umami Analytics, une solution d'analyse respectueuse de la vie privée qui ne 
              collecte pas de données personnelles et conforme au RGPD.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">3. Liste des cookies utilisés</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 my-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du cookie</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finalité</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée de conservation</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">session</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Gestion de la session utilisateur</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Session (supprimé à la fermeture du navigateur)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">cart</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Sauvegarde des articles dans le panier</td>
                    <td className="px-6 py-4 text-sm text-gray-500">30 jours</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">umami.uuid</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Identifiant anonyme pour les statistiques de visite (Umami)</td>
                    <td className="px-6 py-4 text-sm text-gray-500">1 an</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">cookie-consent</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Sauvegarde de vos préférences concernant les cookies</td>
                    <td className="px-6 py-4 text-sm text-gray-500">6 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">4. Gestion des cookies</h2>
            <p>
              Lors de votre première visite sur notre site, une bannière vous informe de la présence de ces cookies 
              et vous invite à indiquer votre choix. Ils ne sont déposés que si vous les acceptez ou que vous poursuivez 
              votre navigation sur le site en visitant une seconde page.
            </p>
            <p>
              Vous pouvez à tout moment modifier vos choix en cliquant sur le lien "Gérer mes cookies" présent en bas 
              de chaque page du site.
            </p>
            <p className="mt-4">
              Vous pouvez également configurer votre navigateur pour qu'il vous avertisse de la présence de cookies 
              et vous propose de les accepter ou non. Vous pouvez accepter ou refuser les cookies au cas par cas ou 
              bien les refuser systématiquement.
            </p>
            <p>
              Nous vous rappelons que le paramétrage est susceptible de modifier vos conditions d'accès à nos 
              services nécessitant l'utilisation de cookies.
            </p>
            <p className="mt-4">
              Voici comment contrôler et supprimer les cookies selon votre navigateur :
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><a href="https://support.google.com/chrome/answer/95647?hl=fr" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">Chrome</a></li>
              <li><a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">Firefox</a></li>
              <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">Edge</a></li>
              <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">Safari</a></li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">5. Modifications de la politique de cookies</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de cookies à tout moment. Tout changement 
              substantiel apporté à cette politique fera l'objet d'une notification sur notre site web.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles 
              modifications.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-primary-800 mb-4">6. Nous contacter</h2>
            <p>
              Si vous avez des questions concernant notre politique de cookies, vous pouvez nous contacter :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="font-medium">CodeParfum.fr</p>
              <p>10 rue des Senteurs</p>
              <p>75008 Paris</p>
              <p>France</p>
              <p className="mt-2">Email : <span className="text-primary-600">dpo@atelierolfactifprive.fr</span></p>
            </div>
            <p className="mt-6">
              Pour plus d'informations sur la gestion de vos données personnelles, vous pouvez consulter notre 
              <Link href="/politique-confidentialite" className="text-primary-600 hover:text-primary-800"> Politique de Confidentialité</Link>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
} 