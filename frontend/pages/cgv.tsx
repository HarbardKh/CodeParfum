import Layout from '@/components/layout/Layout';

export default function CGV() {
  return (
    <Layout title="Conditions Générales de Vente - Codeparfum">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-[#8A1538] mb-8 text-center">
          Conditions Générales de Vente
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 prose prose-primary max-w-none">
          <p className="text-sm text-gray-500 mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Préambule</h2>
            <p className="text-gray-700">
              Les présentes conditions générales de vente s'appliquent à toutes les ventes conclues sur le site L'Art des Senteurs. Tout achat effectué sur le site implique l'acceptation préalable des présentes conditions générales de vente.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Produits</h2>
            <p className="text-gray-700">
              Les caractéristiques essentielles des produits sont indiquées dans la fiche produit. Les photographies illustrant les produits n'entrent pas dans le champ contractuel et ne sont pas parfaitement représentatives de la réalité en raison de la numérisation des images et de l'affichage des couleurs qui peuvent varier d'un écran à l'autre.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Prix</h2>
            <p className="text-gray-700">
              Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC), hors frais de livraison. Les frais de livraison sont indiqués lors de la validation de la commande. L'Art des Senteurs se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Paiement</h2>
            <p className="text-gray-700">
              Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard), PayPal, ou virement bancaire. Votre commande sera traitée dès réception du paiement.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Livraison</h2>
            <p className="text-gray-700">
              Les délais de livraison sont donnés à titre indicatif. Tout retard raisonnable dans la livraison des produits ne pourra pas donner lieu au profit de l'acheteur à l'allocation de dommages et intérêts ou à l'annulation de la commande.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Droit de rétractation</h2>
            <p className="text-gray-700">
              Conformément aux dispositions légales en vigueur, vous disposez d'un délai de 14 jours à compter de la réception des produits pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités. Les frais de retour sont à votre charge.
            </p>
            <p className="text-gray-700 mt-4">
              Pour exercer votre droit de rétractation, vous devez nous notifier votre décision de rétractation au moyen d'une déclaration dénuée d'ambiguïté (par exemple, lettre envoyée par la poste, télécopie ou courrier électronique) à l'adresse suivante : contact@artdessenteurs.fr.
            </p>
            <p className="text-gray-700 mt-4">
              En cas de rétractation de votre part, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison (à l'exception des frais supplémentaires découlant du fait que vous avez choisi, le cas échéant, un mode de livraison autre que le mode moins coûteux de livraison standard proposé par nous) sans retard excessif et, en tout état de cause, au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Garanties</h2>
            <p className="text-gray-700">
              Tous nos produits bénéficient de la garantie légale de conformité et de la garantie légale contre les vices cachés. En cas de non-conformité d'un produit vendu, il pourra être retourné, échangé ou remboursé selon les conditions légales en vigueur.
            </p>
            <p className="text-gray-700 mt-4">
              Pour toute garantie commerciale éventuellement applicable à un article en particulier, veuillez vous référer à la fiche produit correspondante.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Litige</h2>
            <p className="text-gray-700">
              En cas de litige, une solution amiable sera recherchée avant tout recours judiciaire. À défaut d'accord amiable, le tribunal compétent sera celui du lieu du domicile du défendeur ou, au choix du demandeur, du lieu de livraison effective du produit.
            </p>
            <p className="text-gray-700 mt-4">
              Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, L'Art des Senteurs adhère au Service du Médiateur du e-commerce de la FEVAD (Fédération du e-commerce et de la vente à distance) dont les coordonnées sont les suivantes : 60 rue de la Boétie – 75008 Paris – contact@fevad.com.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-700">
              Tous les éléments du site L'Art des Senteurs sont et restent la propriété intellectuelle et exclusive de L'Art des Senteurs. Nul n'est autorisé à reproduire, exploiter, rediffuser, ou utiliser à quelque titre que ce soit, même partiellement, des éléments du site qu'ils soient logiciels, visuels ou sonores.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-[#8A1538] mb-4">Droit applicable</h2>
            <p className="text-gray-700">
              Les présentes conditions générales de vente sont soumises au droit français. La langue du présent contrat est la langue française. En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
