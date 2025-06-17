import Layout from '@/components/layout/Layout';

export default function PolitiqueConfidentialite() {
  return (
    <Layout title="Politique de Confidentialité - CodeParfum.fr">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-primary-900 mb-8 text-center">
          Politique de Confidentialité
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 prose prose-primary max-w-none">
          <p className="text-sm text-gray-500 mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">1. Introduction</h2>
            <p>
              La présente politique de confidentialité a pour but de vous informer sur la manière dont 
              CodeParfum.fr, en tant que responsable de traitement, collecte et utilise vos 
              données à caractère personnel dans le cadre de l'utilisation de notre site internet, ainsi 
              que des droits dont vous disposez.
            </p>
            <p>
              CodeParfum.fr s'engage à respecter la confidentialité de vos données personnelles 
              et à les traiter conformément aux dispositions du Règlement général sur la protection des données 
              (RGPD) et à la loi Informatique et Libertés modifiée.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">2. Identité du responsable de traitement</h2>
            <p>
              Le responsable du traitement des données à caractère personnel est :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4 mb-4">
              <p className="font-medium">CodeParfum.fr</p>
              <p>SAS au capital de 10 000 €</p>
              <p>RCS Paris B 123 456 789</p>
              <p>SIRET : 123 456 789 00012</p>
              <p>Siège social : 10 rue des Senteurs, 75008 Paris, France</p>
              <p>Téléphone : 01 23 45 67 89</p>
              <p>Email : contact@atelierolfactifprive.fr</p>
            </div>
            <p>
              Délégué à la protection des données : Vous pouvez contacter notre délégué à la protection 
              des données à l'adresse suivante : dpo@atelierolfactifprive.fr
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">3. Données collectées</h2>
            <p>
              Nous collectons et traitons les données à caractère personnel suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <span className="font-medium">Données d'identification</span> : nom, prénom, adresse e-mail, numéro de téléphone, 
                adresse postale, date de naissance.
              </li>
              <li>
                <span className="font-medium">Données relatives à vos commandes</span> : historique des achats, produits consultés, 
                préférences olfactives.
              </li>
              <li>
                <span className="font-medium">Données de connexion et de navigation</span> : adresse IP, cookies, pages consultées, 
                durée de connexion, date et heure de connexion.
              </li>
              <li>
                <span className="font-medium">Données de paiement</span> : ces données sont collectées et traitées par notre 
                prestataire de paiement sécurisé et ne sont pas stockées sur nos serveurs.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">4. Finalités des traitements</h2>
            <p>
              Nous traitons vos données à caractère personnel pour les finalités suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Gestion de vos commandes, livraisons et facturations
              </li>
              <li>
                Gestion de votre compte client et du service après-vente
              </li>
              <li>
                Personnalisation de votre expérience sur notre site et recommandations de produits adaptés à vos préférences
              </li>
              <li>
                Envoi de newsletters et communications commerciales (sous réserve de votre consentement)
              </li>
              <li>
                Amélioration de nos produits et services
              </li>
              <li>
                Réalisation de statistiques et analyses commerciales
              </li>
              <li>
                Gestion des avis clients
              </li>
              <li>
                Réponse à vos demandes et questions
              </li>
              <li>
                Prévention et lutte contre la fraude
              </li>
              <li>
                Respect de nos obligations légales et réglementaires
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">5. Bases légales des traitements</h2>
            <p>
              Nous traitons vos données à caractère personnel sur les bases légales suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <span className="font-medium">Exécution du contrat</span> : lorsque le traitement est nécessaire à l'exécution du 
                contrat conclu avec vous (gestion des commandes, livraisons, etc.)
              </li>
              <li>
                <span className="font-medium">Consentement</span> : lorsque vous nous avez donné votre consentement explicite 
                (envoi de newsletters et communications commerciales)
              </li>
              <li>
                <span className="font-medium">Intérêt légitime</span> : lorsque le traitement est nécessaire aux fins des intérêts 
                légitimes que nous poursuivons (amélioration de nos services, prévention de la fraude)
              </li>
              <li>
                <span className="font-medium">Obligation légale</span> : lorsque le traitement est nécessaire au respect d'une 
                obligation légale à laquelle nous sommes soumis
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">6. Durée de conservation des données</h2>
            <p>
              Nous conservons vos données personnelles pour une durée limitée, proportionnelle aux finalités 
              pour lesquelles elles ont été collectées. Les durées de conservation sont les suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <span className="font-medium">Données relatives aux comptes clients</span> : pendant toute la durée de la relation commerciale 
                et jusqu'à 3 ans après le dernier contact ou la fin de la relation commerciale
              </li>
              <li>
                <span className="font-medium">Données relatives aux commandes et factures</span> : 10 ans à compter de la fin de la relation 
                commerciale (obligations comptables et fiscales)
              </li>
              <li>
                <span className="font-medium">Données de navigation et cookies</span> : 13 mois maximum
              </li>
              <li>
                <span className="font-medium">Données relatives aux prospects</span> : 3 ans à compter du dernier contact
              </li>
            </ul>
            <p>
              Au terme de ces périodes, vos données seront supprimées ou anonymisées à des fins statistiques.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">7. Destinataires des données</h2>
            <p>
              Dans la limite de leurs attributions respectives et pour les finalités rappelées ci-dessus, 
              les principales personnes qui seront susceptibles d'avoir accès à vos données sont :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Le personnel autorisé de nos services commerciaux, marketing, administratifs, logistiques et informatiques
              </li>
              <li>
                Nos sous-traitants, dont :
                <ul className="list-disc pl-6 mt-2">
                  <li>Fournisseurs de services de paiement</li>
                  <li>Prestataires de logistique et de transport</li>
                  <li>Prestataires d'hébergement</li>
                  <li>Prestataires de services marketing et d'analyse</li>
                </ul>
              </li>
              <li>
                Les organismes publics, autorités judiciaires ou administratives, en cas d'obligation légale
              </li>
            </ul>
            <p>
              Nous exigeons de nos sous-traitants qu'ils respectent la confidentialité et la sécurité des 
              données, et qu'ils les traitent conformément à la réglementation en vigueur.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">8. Transferts des données hors UE</h2>
            <p>
              Certaines de vos données peuvent faire l'objet d'un transfert vers des pays situés en dehors 
              de l'Union Européenne, notamment dans le cadre de l'utilisation de certains outils informatiques.
            </p>
            <p>
              Dans ce cas, nous nous assurons que ces transferts sont effectués vers des pays garantissant 
              un niveau de protection adéquat, ou qu'ils sont encadrés par des clauses contractuelles types 
              de la Commission Européenne ou par tout autre mécanisme assurant un niveau de protection suffisant 
              et approprié.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">9. Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation, analyser notre 
              trafic et personnaliser le contenu. Pour plus d'informations sur les cookies que nous utilisons 
              et la manière de les paramétrer, veuillez consulter notre 
              <a href="/politique-cookies" className="text-primary-600 hover:text-primary-800"> Politique de Cookies</a>.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">10. Vos droits</h2>
            <p>
              Conformément à la réglementation en vigueur, vous disposez des droits suivants concernant 
              vos données personnelles :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <span className="font-medium">Droit d'accès</span> : vous pouvez obtenir des informations concernant le traitement 
                de vos données ainsi qu'une copie de celles-ci
              </li>
              <li>
                <span className="font-medium">Droit de rectification</span> : vous pouvez demander la rectification des données inexactes 
                ou incomplètes
              </li>
              <li>
                <span className="font-medium">Droit à l'effacement (droit à l'oubli)</span> : vous pouvez demander l'effacement de vos 
                données dans certains cas
              </li>
              <li>
                <span className="font-medium">Droit à la limitation du traitement</span> : vous pouvez demander la limitation du traitement 
                de vos données
              </li>
              <li>
                <span className="font-medium">Droit à la portabilité</span> : vous pouvez demander à recevoir vos données dans un format 
                structuré, couramment utilisé et lisible par machine, ou à ce qu'elles soient transmises à un autre responsable de traitement
              </li>
              <li>
                <span className="font-medium">Droit d'opposition</span> : vous pouvez vous opposer au traitement de vos données, 
                notamment à des fins de prospection commerciale
              </li>
              <li>
                <span className="font-medium">Droit de retirer votre consentement</span> à tout moment, lorsque le traitement est fondé 
                sur votre consentement
              </li>
              <li>
                <span className="font-medium">Droit de définir des directives</span> relatives au sort de vos données après votre décès
              </li>
            </ul>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter par email à dpo@atelierolfactifprive.fr 
              ou par courrier à l'adresse suivante : CodeParfum.fr - DPO, 10 rue des Senteurs, 75008 Paris, France.
            </p>
            <p>
              Une copie d'une pièce d'identité pourra vous être demandée. Nous nous efforcerons de répondre 
              à votre demande dans un délai d'un mois, qui pourra être prolongé de deux mois en cas de demande complexe.
            </p>
            <p>
              Vous disposez également du droit d'introduire une réclamation auprès de la Commission Nationale 
              de l'Informatique et des Libertés (CNIL) : www.cnil.fr
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">11. Sécurité des données</h2>
            <p>
              CodeParfum.fr met en œuvre des mesures techniques et organisationnelles appropriées 
              afin de garantir un niveau de sécurité adapté au risque, notamment :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Chiffrement des données sensibles</li>
              <li>Protection contre les accès non autorisés</li>
              <li>Sauvegarde régulière des données</li>
              <li>Évaluation régulière de l'efficacité des mesures de sécurité</li>
            </ul>
            <p>
              En cas de violation de données susceptible d'engendrer un risque pour vos droits et libertés, 
              nous nous engageons à vous en informer dans les meilleurs délais et à notifier cette violation 
              à la CNIL dans les conditions prévues par le RGPD.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-primary-800 mb-4">12. Modification de la politique de confidentialité</h2>
            <p>
              Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. 
              En cas de modification substantielle, nous vous informerons par email ou par un avis visible sur 
              notre site internet.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des 
              éventuelles modifications.
            </p>
            <p className="mt-4">
              La présente politique de confidentialité a été mise à jour le {new Date().toLocaleDateString('fr-FR')}.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
} 