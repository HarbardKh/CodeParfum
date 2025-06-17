import Layout from '@/components/layout/Layout';

export default function MentionsLegales() {
  return (
    <Layout title="Mentions Légales - CodeParfum.fr">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-primary-900 mb-8 text-center">
          Mentions Légales
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 prose prose-primary max-w-none">
          <p className="text-sm text-gray-500 mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">1. Éditeur du site</h2>
            <p>
              Le site Internet "CodeParfum.fr" est édité par :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4 mb-4">
              <p className="font-medium">CodeParfum.fr</p>
              <p>SAS au capital de 10 000 €</p>
              <p>RCS Paris B 123 456 789</p>
              <p>SIRET : 123 456 789 00012</p>
              <p>Code APE : 4775Z</p>
              <p>Numéro de TVA intracommunautaire : FR 12 123456789</p>
              <p>Siège social : 10 rue des Senteurs, 75008 Paris, France</p>
              <p>Téléphone : 01 23 45 67 89</p>
              <p>Email : contact@atelierolfactifprive.fr</p>
            </div>
            <p>
              Directeur de la publication : Madame Sophie Dubois, en qualité de Présidente.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">2. Hébergement</h2>
            <p>
              Le site CodeParfum.fr est hébergé par :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4 mb-4">
              <p className="font-medium">OVH SAS</p>
              <p>Siège social : 2 rue Kellermann - 59100 Roubaix - France</p>
              <p>RCS Lille Métropole 424 761 419 00045</p>
              <p>Code APE : 6202A</p>
              <p>N° TVA : FR 22 424 761 419</p>
              <p>Téléphone : 1007</p>
              <p>Site web : www.ovh.com</p>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">3. Propriété intellectuelle</h2>
            <p>
              La structure générale, les textes, les images animées ou non, les savoir-faire, les programmes 
              et logiciels ainsi que tout autre élément composant le site www.atelierolfactifprive.fr 
              sont la propriété exclusive de la société CodeParfum.fr.
            </p>
            <p>
              Toute représentation totale ou partielle de ce site par quelque procédé que ce soit, sans 
              l'autorisation expresse de la société CodeParfum.fr est interdite et constituerait 
              une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>
            <p>
              Les marques de CodeParfum.fr et de ses partenaires, ainsi que les logos figurant sur 
              le site sont des marques déposées. Toute reproduction totale ou partielle de ces marques ou de 
              ces logos, effectuée à partir des éléments du site sans l'autorisation expresse de CodeParfum.fr 
              est donc prohibée, au sens de l'article L.713-2 du Code de la propriété intellectuelle.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">4. Protection des données personnelles</h2>
            <p>
              CodeParfum.fr respecte la vie privée de ses utilisateurs et s'engage à ce que toutes 
              les informations qu'il recueille permettant de les identifier soient considérées comme des 
              informations confidentielles.
            </p>
            <p>
              Les informations recueillies font l'objet d'un traitement informatique destiné à permettre 
              à CodeParfum.fr de traiter les commandes, de fournir des informations sur les produits et 
              d'assurer le service après-vente. Le destinataire des données est CodeParfum.fr.
            </p>
            <p>
              Conformément à la loi « informatique et libertés » du 6 janvier 1978 modifiée en 2004, vous 
              bénéficiez d'un droit d'accès et de rectification aux informations qui vous concernent, que 
              vous pouvez exercer en vous adressant à CodeParfum.fr, 10 rue des Senteurs, 75008 Paris, 
              ou par email à l'adresse : dpo@atelierolfactifprive.fr.
            </p>
            <p>
              Vous pouvez également, pour des motifs légitimes, vous opposer au traitement des données vous concernant.
            </p>
            <p>
              Pour plus d'informations sur le traitement de vos données personnelles, veuillez consulter notre 
              <a href="/politique-confidentialite" className="text-primary-600 hover:text-primary-800"> Politique de Confidentialité</a>.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">5. Cookies</h2>
            <p>
              L'utilisateur est informé que lors de ses visites sur le site, un cookie peut s'installer 
              automatiquement sur son logiciel de navigation. Un cookie est un élément qui ne permet pas 
              d'identifier l'utilisateur mais sert à enregistrer des informations relatives à la navigation 
              de celui-ci sur le site Internet.
            </p>
            <p>
              Les utilisateurs du site reconnaissent avoir été informés de cette pratique et autorisent 
              CodeParfum.fr à l'employer. Ils pourront désactiver ce cookie par l'intermédiaire des 
              paramètres figurant au sein de leur logiciel de navigation.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">6. Limitation de responsabilité</h2>
            <p>
              CodeParfum.fr s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise 
              à jour des informations diffusées sur son site, dont elle se réserve le droit de corriger, 
              à tout moment et sans préavis, le contenu.
            </p>
            <p>
              Toutefois, CodeParfum.fr ne peut garantir l'exactitude, la précision ou l'exhaustivité 
              des informations mises à la disposition sur son site.
            </p>
            <p>
              En conséquence, CodeParfum.fr décline toute responsabilité :
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>
                pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site ;
              </li>
              <li>
                pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une 
                modification des informations mises à la disposition sur le site ;
              </li>
              <li>
                et plus généralement pour tous dommages, directs ou indirects, qu'elles qu'en soient les 
                causes, origines, nature ou conséquences, provoqués à raison de l'accès de quiconque au 
                site ou de l'impossibilité d'y accéder, de même que l'utilisation du site et/ou du crédit 
                accordé à une quelconque information provenant directement ou indirectement de ce dernier.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">7. Liens hypertextes</h2>
            <p>
              Les liens hypertextes mis en place dans le cadre du présent site internet en direction d'autres 
              ressources présentes sur le réseau Internet ne sauraient engager la responsabilité de 
              CodeParfum.fr.
            </p>
            <p>
              De même, les tiers ne peuvent mettre en place un lien hypertexte en direction du site 
              CodeParfum.fr sans l'autorisation expresse et préalable de CodeParfum.fr.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-medium text-primary-800 mb-4">8. Droit applicable et juridiction compétente</h2>
            <p>
              Les présentes mentions légales sont régies par la loi française.
            </p>
            <p>
              En cas de litige relatif à l'interprétation ou à l'exécution des présentes, les tribunaux 
              français seront seuls compétents.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-medium text-primary-800 mb-4">9. Contact</h2>
            <p>
              Pour toute question concernant les présentes mentions légales, vous pouvez nous écrire à :
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="font-medium">CodeParfum.fr - Service Juridique</p>
              <p>10 rue des Senteurs</p>
              <p>75008 Paris</p>
              <p>France</p>
              <p className="mt-2">Email : <span className="text-primary-600">juridique@atelierolfactifprive.fr</span></p>
              <p>Téléphone : 01 23 45 67 89</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 