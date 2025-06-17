import Layout from '@/components/layout/Layout';

export default function ConditionsVente() {
  return (
    <Layout title="Conditions Générales de Vente - Codeparfum">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-primary-900 mb-8 text-center">
          Conditions Générales de Vente
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 prose prose-primary max-w-none">
          <p className="text-sm text-gray-500 mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 1 - Champ d'application</h2>
            <p>
              Les présentes Conditions Générales de Vente (ci-après "CGV") s'appliquent à toutes les ventes 
              conclues sur le site Internet Codeparfum, entre :
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>
                D'une part, la société Codeparfum, SAS au capital de 10 000 euros, 
                immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789, 
                dont le siège social est situé au 10 rue des Senteurs, 75008 Paris, France, ci-après 
                dénommée "le Vendeur" ;
              </li>
              <li>
                Et d'autre part, toute personne physique ou morale procédant à l'achat de produits ou services 
                du Vendeur, ci-après dénommée "l'Acheteur".
              </li>
            </ul>
            <p>
              Les CGV encadrent les conditions de vente des produits proposés par le Vendeur. Elles s'appliquent 
              à l'exclusion de toutes autres conditions, notamment celles applicables pour les ventes en magasin 
              ou par d'autres circuits de distribution et de commercialisation.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 2 - Prix</h2>
            <p>
              Les prix des produits vendus sur le site Internet sont indiqués en euros toutes taxes comprises (TTC) 
              et précisément déterminés sur les pages de descriptifs des produits. Ils sont également indiqués en 
              euros TTC sur la page de commande des produits.
            </p>
            <p>
              Les frais de livraison sont indiqués avant la validation de la commande. Ces frais sont entendus TTC.
            </p>
            <p>
              La société Codeparfum se réserve le droit de modifier ses prix à tout moment, mais les 
              produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 3 - Commandes</h2>
            <p>
              L'Acheteur a la possibilité de passer sa commande en ligne, à partir du catalogue en ligne et au 
              moyen du formulaire qui y figure, pour tout produit, dans la limite des stocks disponibles.
            </p>
            <p>
              L'Acheteur sera informé de toute indisponibilité du produit ou du service commandé.
            </p>
            <p>
              Pour que la commande soit validée, l'Acheteur devra accepter, en cliquant à l'endroit indiqué, 
              les présentes Conditions Générales de Vente. Il devra aussi choisir l'adresse et le mode de livraison, 
              et enfin valider le mode de paiement.
            </p>
            <p>
              La vente ne sera considérée comme définitive qu'après l'envoi à l'Acheteur de la confirmation 
              de l'acceptation de la commande par le Vendeur par courrier électronique et après encaissement 
              par le Vendeur de l'intégralité du prix.
            </p>
            <p>
              Toute commande passée sur le site constitue la formation d'un contrat conclu à distance entre 
              l'Acheteur et le Vendeur.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 4 - Produits</h2>
            <p>
              Les caractéristiques essentielles des produits et leurs prix respectifs sont mis à disposition 
              de l'Acheteur sur le site Internet de la société Codeparfum.
            </p>
            <p>
              Conformément à l'article L112-1 du Code de la consommation, le consommateur est informé, par voie 
              de marquage, d'étiquetage, d'affichage ou par tout autre procédé approprié, des prix et des conditions 
              particulières de la vente et de l'exécution des services avant toute conclusion du contrat de vente.
            </p>
            <p>
              En conformité avec l'article L111-1 du Code de la consommation, les informations sur les caractéristiques 
              essentielles des produits sont accessibles sur le site. L'Acheteur est informé des caractéristiques essentielles 
              du produit qu'il souhaite acheter.
            </p>
            <p>
              Les photographies et illustrations accompagnant les produits n'ont pas de valeur contractuelle et ne 
              sauraient donc engager la responsabilité du Vendeur.
            </p>
            <p>
              L'Acheteur est tenu de se reporter au descriptif de chaque produit afin d'en connaître les 
              caractéristiques et particularités.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 5 - Paiement</h2>
            <p>
              Le paiement est exigible immédiatement à la commande, y compris pour les produits en précommande. 
              L'Acheteur peut effectuer le règlement par carte de paiement.
            </p>
            <p>
              Les cartes émises par des banques domiciliées hors de France doivent obligatoirement être des 
              cartes bancaires internationales (Mastercard ou Visa).
            </p>
            <p>
              Le paiement sécurisé en ligne par carte bancaire est réalisé par notre prestataire de paiement. 
              Les informations transmises sont chiffrées dans les règles de l'art et ne peuvent être lues au 
              cours du transport sur le réseau.
            </p>
            <p>
              Une fois le paiement lancé par l'Acheteur, la transaction est immédiatement débitée après 
              vérification des informations. L'engagement de payer donné par carte est irrévocable.
            </p>
            <p>
              En communiquant ses informations bancaires lors de la vente, l'Acheteur autorise le Vendeur à 
              débiter sa carte du montant relatif au prix indiqué. L'Acheteur confirme qu'il est bien le 
              titulaire légal de la carte à débiter et qu'il est légalement en droit d'en faire usage.
            </p>
            <p>
              En cas d'erreur, ou d'impossibilité de débiter la carte, la vente est immédiatement résolue de plein droit 
              et la commande annulée.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 6 - Livraison</h2>
            <p>
              La livraison s'entend du transfert au consommateur de la possession physique ou du contrôle du bien.
            </p>
            <p>
              Les produits commandés sont livrés selon les modalités suivantes :
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>
                Livraison standard (3-5 jours ouvrés) : 4,90€
              </li>
              <li>
                Livraison express (24-48h) : 9,90€
              </li>
              <li>
                Livraison gratuite pour toute commande supérieure à 75€
              </li>
            </ul>
            <p>
              Les livraisons sont assurées par un transporteur indépendant, à l'adresse mentionnée par l'Acheteur 
              lors de la commande et à laquelle le transporteur pourra facilement accéder.
            </p>
            <p>
              Lorsque l'Acheteur s'est lui-même chargé de faire appel à un transporteur qu'il choisit lui-même, 
              la livraison est réputée effectuée dès la remise des produits commandés par le Vendeur au transporteur. 
              Dans un tel cas, l'Acheteur reconnaît donc que c'est le transporteur qu'il a lui-même choisi qui est 
              responsable de la livraison et que la responsabilité du Vendeur ne saurait être engagée à cet égard.
            </p>
            <p>
              En cas de demande particulière de l'Acheteur concernant les conditions d'emballage ou de transport 
              des produits commandés, dûment acceptées par écrit par le Vendeur, les coûts liés feront l'objet 
              d'une facturation spécifique complémentaire, sur devis préalablement accepté par écrit par l'Acheteur.
            </p>
            <p>
              L'Acheteur est tenu de vérifier l'état des produits livrés. Il dispose d'un délai de 48 heures à 
              compter de la livraison pour formuler des réclamations par mail (service-client@atelierolfactifprive.fr), 
              accompagnées de tous les justificatifs y afférents (photos notamment). Passé ce délai et à défaut d'avoir 
              respecté ces formalités, les produits seront réputés conformes et exempts de tout vice apparent et aucune 
              réclamation ne pourra être valablement acceptée par le Vendeur.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 7 - Droit de rétractation</h2>
            <p>
              Conformément aux dispositions légales en vigueur, l'Acheteur dispose d'un délai de 14 jours à compter 
              de la réception du produit pour exercer son droit de rétractation auprès du Vendeur, sans avoir à 
              justifier de motifs ni à payer de pénalité.
            </p>
            <p>
              En cas d'exercice du droit de rétractation dans le délai susmentionné, le prix du ou des produits 
              achetés et les frais d'envoi seront remboursés, les frais de retour restant à la charge de l'Acheteur.
            </p>
            <p>
              Les retours des produits sont à effectuer dans leur état d'origine et complets (emballage, accessoires, 
              notice...) ; ils doivent si possible être accompagnés d'une copie du justificatif d'achat.
            </p>
            <p>
              Conformément aux dispositions légales, vous trouverez ci-après le formulaire-type de rétractation à nous 
              adresser à l'adresse : service-client@atelierolfactifprive.fr
            </p>
            <div className="border p-4 rounded-lg bg-gray-50 my-4">
              <p className="font-medium mb-2">Formulaire de rétractation</p>
              <p>À l'attention de Codeparfum, 10 rue des Senteurs, 75008 Paris, France :</p>
              <p>Je notifie par la présente ma rétractation du contrat portant sur la vente du/des produit(s) suivant(s) : [indiquer les produits]</p>
              <p>Commandé(s) le [date] / reçu(s) le [date]</p>
              <p>Nom du consommateur : ...</p>
              <p>Adresse du consommateur : ...</p>
              <p>Signature du consommateur (uniquement en cas de notification du présent formulaire sur papier) : ...</p>
              <p>Date : ...</p>
            </div>
            <p>
              Exceptions au droit de rétractation :
            </p>
            <p>
              Conformément aux dispositions de l'article L.121-21-8 du Code de la Consommation, le droit de 
              rétractation ne s'applique pas à :
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>
                La fourniture de biens qui ont été descellés par le consommateur après la livraison et qui ne 
                peuvent être renvoyés pour des raisons d'hygiène ou de protection de la santé (produits cosmétiques 
                ouverts, parfums dont le sceau de sécurité a été brisé, etc.).
              </li>
              <li>
                La fourniture de biens confectionnés selon les spécifications du consommateur ou nettement 
                personnalisés (parfums sur mesure, compositions personnalisées, etc.).
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 8 - Garanties</h2>
            <p>
              Conformément à la loi, le Vendeur assume deux garanties : de conformité et relative aux vices cachés 
              des produits. Le Vendeur rembourse l'Acheteur ou échange les produits apparemment défectueux ou ne 
              correspondant pas à la commande effectuée.
            </p>
            <p>
              <span className="font-medium">Garantie légale de conformité :</span> L'Acheteur dispose d'un délai de 2 ans 
              à compter de la délivrance du produit pour mettre en œuvre la garantie légale de conformité.
            </p>
            <p>
              <span className="font-medium">Garantie des vices cachés :</span> L'Acheteur peut décider de mettre en œuvre 
              la garantie contre les défauts cachés de la chose vendue au sens de l'article 1641 du code civil. 
              Dans cette hypothèse, il peut choisir entre la résolution de la vente ou une réduction du prix de 
              vente conformément à l'article 1644 du Code Civil.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 9 - Responsabilité</h2>
            <p>
              Les produits proposés sont conformes à la législation française en vigueur. La responsabilité du 
              Vendeur ne saurait être engagée en cas de non-respect de la législation du pays où les produits 
              sont livrés. Il appartient à l'Acheteur de vérifier auprès des autorités locales les possibilités 
              d'importation ou d'utilisation des produits qu'il envisage de commander.
            </p>
            <p>
              Le Vendeur ne pourra être tenu pour responsable des dommages de toute nature, tant matériels 
              qu'immatériels ou corporels, qui pourraient résulter d'un mauvais fonctionnement ou de la mauvaise 
              utilisation des produits commercialisés. Il en est de même pour les éventuelles modifications des 
              produits résultant des fabricants.
            </p>
            <p>
              La responsabilité du Vendeur sera limitée au montant de la commande et ne saurait être mise en 
              cause pour de simples erreurs ou omissions qui auraient pu subsister malgré toutes les précautions 
              prises dans la présentation des produits.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 10 - Propriété intellectuelle</h2>
            <p>
              Tous les éléments du site www.atelierolfactifprive.fr sont et restent la propriété intellectuelle 
              et exclusive du Vendeur. Nul n'est autorisé à reproduire, exploiter, rediffuser, ou utiliser à 
              quelque titre que ce soit, même partiellement, des éléments du site qu'ils soient logiciels, 
              visuels ou sonores.
            </p>
            <p>
              Tout lien simple ou par hypertexte est strictement interdit sans un accord écrit exprès du Vendeur.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 11 - Données personnelles</h2>
            <p>
              La société Codeparfum se réserve le droit de collecter les informations nominatives 
              et les données personnelles concernant l'Acheteur, nécessaires à la gestion de sa commande.
            </p>
            <p>
              Les informations et données concernant l'Acheteur sont nécessaires à la gestion des commandes et 
              aux relations commerciales. Ces informations et données sont également conservées à des fins de 
              sécurité, afin de respecter les obligations légales et réglementaires.
            </p>
            <p>
              Conformément à la loi du 6 janvier 1978, l'Acheteur dispose d'un droit d'accès, de rectification et 
              d'opposition aux informations nominatives et aux données personnelles le concernant, directement sur 
              le site Internet.
            </p>
            <p>
              Pour en savoir plus sur la gestion des données personnelles, veuillez consulter notre Politique de 
              Confidentialité accessible sur notre site.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 12 - Archivage et preuve</h2>
            <p>
              Codeparfum archivera les bons de commandes et les factures sur un support fiable 
              et durable constituant une copie fidèle.
            </p>
            <p>
              Les registres informatisés seront considérés par les parties comme preuve des communications, 
              commandes, paiements et transactions intervenus entre les parties.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 13 - Droit applicable et litiges</h2>
            <p>
              Les présentes Conditions Générales de Vente et les opérations qui en découlent sont régies et 
              soumises au droit français.
            </p>
            <p>
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
            <p>
              Conformément aux dispositions des articles L. 611-1 à L. 616-3 du Code de la consommation, 
              l'Acheteur est informé qu'il peut recourir à un médiateur de la consommation dans les conditions 
              prévues par le titre Ier du livre VI du Code de la consommation.
            </p>
            <p>
              En cas de difficultés survenant lors de la commande ou de la livraison des articles, l'Acheteur 
              a la possibilité, avant toute action en justice, de rechercher une solution amiable, notamment 
              avec l'aide d'une association de consommateurs ou de tout autre conseil de son choix.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-primary-800 mb-4">Article 14 - Contact</h2>
            <p>
              Pour toute question relative aux présentes CGV ou à une commande, vous pouvez contacter notre 
              service client :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="font-medium">Codeparfum - Service Client</p>
              <p>10 rue des Senteurs</p>
              <p>75008 Paris</p>
              <p>France</p>
              <p className="mt-2">Email : <span className="text-primary-600">service-client@atelierolfactifprive.fr</span></p>
              <p>Téléphone : 01 23 45 67 89</p>
              <p>Horaires : Du lundi au vendredi de 9h à 18h</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 