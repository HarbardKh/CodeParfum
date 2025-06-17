import { GetStaticPaths, GetStaticProps } from 'next';
import { sanitizeRichTextFields, richTextToPlainText } from '@/utils/richTextConverter';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import type { Product } from '../../types/product';
import { fetchData } from '@/services/apiService';

interface ProductPageProps {
  product: Product | null;
  error?: string;
}

// Interface pour la réponse paginée de l'API
interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export default function ProductPage({ product, error }: ProductPageProps) {
  const router = useRouter();

  // Afficher un état de chargement pendant le chargement côté client
  if (router.isFallback) {
    return (
      <Layout title="Chargement... - CodeParfum.fr">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Chargement en cours...</h1>
            <p className="text-gray-500">Veuillez patienter pendant le chargement du produit</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Gérer le cas où le produit n'est pas trouvé
  if (!product) {
    return (
      <Layout title="Produit Non Trouvé - CodeParfum.fr">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Produit introuvable</h1>
            <p className="text-gray-600 mb-8">
              {error || "Nous n'avons pas pu trouver le produit que vous recherchez."}
            </p>
            <Link
              href="/catalogue"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Retour au catalogue
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Afficher le produit
  return (
    <Layout title={`${product.name} - CodeParfum.fr`}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-[#f5f0e9]">
        {/* Fil d'Ariane */}
        <div className="mb-6">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/catalogue" className="hover:text-primary-600">Catalogue</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image du produit */}
          <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center h-96 md:h-[450px] shadow-sm">
            <img 
              src={`/images/products/${product.reference || product.id}.jpg`}
              alt={product.name} 
              className="object-cover h-full w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/placeholder.jpg';
              }}
            />
          </div>
          
          {/* Informations du produit */}
          <div className="flex flex-col">
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-500">Réf: {product.reference || product.id}</span>
              <span className="mx-2">-</span>
              <span className="text-sm text-gray-500">{product.gender === 'H' ? 'Homme' : 'Femme'}</span>
            </div>
            
            <h1 className="text-3xl font-serif font-medium text-primary-800 mb-2">{product.name}</h1>
            <div className="flex items-center mt-1 mb-4">
              <span className="text-base text-primary-700">{product.famille_olfactive}</span>
            </div>
            
            <div className="flex items-center justify-between mt-4 mb-6 py-4">
              <div>
                <p className="text-2xl font-medium text-primary-900">{product.price}€</p>
                <p className="text-sm text-gray-500 mt-1">TTC</p>
              </div>
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-md">
                <p className="text-sm text-gray-600">{product.volume || 'Voir détail'}</p>
                {product.volume && product.volume.includes('+') && (
                  <div className="mt-1 text-xs text-green-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Pour chaque parfum de 70 ml acheté, tu reçois gratuitement une recharge de parfum de 15 ml de la même fragrance.
                  </div>
                )}
              </div>
            </div>
            
            {product.description && (
              <div className="mt-6">
                <h2 className="text-base font-medium text-gray-700 mb-2">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
            
            <div className="mt-8">
              <button 
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-md font-medium hover:bg-primary-700 focus:outline-none transition-colors duration-200"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
        
        {/* Informations supplémentaires */}
        {product.pyramideOlfactive && (
          <div className="mt-12">
            <h2 className="text-lg font-medium text-primary-800 mb-4">Pyramide olfactive</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-rose-500 mb-3 flex items-center">
                  <span className="inline-block w-3 h-3 bg-rose-100 rounded-full mr-2"></span>
                  Notes de tête
                </h3>
                <p className="text-sm text-gray-600">
                  {product.pyramideOlfactive.head ? product.pyramideOlfactive.head.join(' - ') : 
                   (product.pyramideOlfactive.notesDeTete ? product.pyramideOlfactive.notesDeTete.join(' - ') : '-')}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-primary-500 mb-3 flex items-center">
                  <span className="inline-block w-3 h-3 bg-primary-100 rounded-full mr-2"></span>
                  Notes de cœur
                </h3>
                <p className="text-sm text-gray-600">
                  {product.pyramideOlfactive.heart ? product.pyramideOlfactive.heart.join(' - ') : 
                   (product.pyramideOlfactive.notesDeCoeur ? product.pyramideOlfactive.notesDeCoeur.join(' - ') : '-')}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-amber-500 mb-3 flex items-center">
                  <span className="inline-block w-3 h-3 bg-amber-100 rounded-full mr-2"></span>
                  Notes de fond
                </h3>
                <p className="text-sm text-gray-600">
                  {product.pyramideOlfactive.base ? product.pyramideOlfactive.base.join(' - ') : 
                   (product.pyramideOlfactive.notesDeFond ? product.pyramideOlfactive.notesDeFond.join(' - ') : '-')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Section À Propos - Version épurée */}
        {product.a_propos && (
          <div className="mt-12">
            <h2 className="text-lg font-medium text-primary-800 mb-4">À propos de ce parfum</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.a_propos}</p>
              <div className="mt-4">
                <img 
                  src="/images/placeholder.jpg" 
                  alt="Image d'ambiance" 
                  className="w-full h-48 object-cover rounded" 
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Section Conseils & Expertise - Version épurée */}
        {product.conseil && (
          <div className="mt-12">
            <h2 className="text-lg font-medium text-primary-800 mb-4">Conseils & Expertise</h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.conseil}</p>
              <div className="mt-4">
                <a href="/guide-conseil/familles-olfactives" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium border border-gray-200 text-primary-700 bg-white hover:bg-gray-50 transition-colors">
                  Découvrir nos guides
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Section expérience sensorielle - Version épurée */}
        <div className="mt-12">
          <h2 className="text-lg font-medium text-primary-800 mb-4">Expérience Sensorielle</h2>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personnalité */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Personnalité</h3>
                <div className="flex flex-wrap gap-2">
                  {[product.famille_olfactive, product.famille_principale, product.famille_secondaire, product.intensite]
                    .filter(Boolean)
                    .map((trait, index: number) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                        {trait}
                      </span>
                    ))}
                </div>
              </div>
              
              {/* Occasion idéale */}
              {product.occasion && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Occasion idéale</h3>
                  <p className="text-sm text-gray-600">{product.occasion}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Section tags et occasion - version simple pour garder la compatibilité */}
        <div className="hidden">
          <div className="flex flex-wrap gap-3 items-center">
            {product.occasion && (
              <div className="mr-6">
                <span className="text-sm font-medium text-gray-600 mr-2">Occasion :</span>
                <span className="text-sm text-gray-800">{product.occasion}</span>
              </div>
            )}
            
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Section produits similaires - À implémenter plus tard */}
      </div>
    </Layout>
  );
}

// Génération des pages produit depuis PayloadCMS
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const { data, error } = await fetchData<PaginatedResponse<any>>(
      '/api/parfums',
      {
        params: {
          limit: 10, // Réduit de 1000 à 10 pour éviter les erreurs 429 (rate limiting)
          depth: 1,
          sort: '-updatedAt' // Générer les produits les plus récemment mis à jour
        }
      }
    );
    
    if (error || !data) {
      console.error('Erreur lors de la récupération des parfums:', error);
      return { paths: [], fallback: 'blocking' };
    }
    
    const products = data.docs || [];
    console.log(`Génération statique pour ${products.length} produits, les autres seront générés à la demande`);
    
    const paths = products.map((p: any) => ({ params: { id: p.slug } }));
    return { 
      paths,
      // 'blocking' signifie que les pages non pré-rendues seront générées côté serveur à la demande
      fallback: 'blocking' 
    };
  } catch (err) {
    console.error('Erreur lors de la génération des chemins:', err);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<ProductPageProps> = async ({ params }) => {
  try {
    const id = params?.id as string;
    
    const { data, error } = await fetchData<PaginatedResponse<any>>(
      '/api/parfums',
      {
        params: {
          'where[slug][equals]': id,
          limit: 1,
          depth: 1
        }
      }
    );
    
    if (error || !data) {
      console.error('Erreur lors de la récupération du parfum:', error);
      return { props: { product: null, error: error?.message }, revalidate: 60 };
    }
    
    const doc = data.docs?.[0] ?? null;
    if (!doc) {
      return { props: { product: null }, revalidate: 60 };
    }
    
    // Sanitiser les données brutes avec notre utilitaire de conversion rich text
    const sanitizedDoc = sanitizeRichTextFields(doc);

    // Créer un objet sanitisé pour éviter les erreurs de sérialisation
    const product: Product = {
      id: sanitizedDoc.id || '',
      reference: sanitizedDoc.reference || null, // Utiliser null au lieu de undefined ou chaîne vide
      slug: sanitizedDoc.slug || '',
      name: sanitizedDoc.nom || '',
      price: typeof sanitizedDoc.prix === 'number' ? sanitizedDoc.prix : 0,
      gender: sanitizedDoc.genre || 'U',
      volume: sanitizedDoc.volume || '',
      famille_olfactive: sanitizedDoc.familleOlfactive?.nom || '',
      intensite: sanitizedDoc.intensite || '',
      occasion: sanitizedDoc.occasion || '',
      // Conversion explicite des champs de texte riche qui causent l'erreur React #31
      description: typeof sanitizedDoc.description === 'string' ? sanitizedDoc.description : richTextToPlainText(sanitizedDoc.description),
      a_propos: typeof sanitizedDoc.aPropos === 'string' ? sanitizedDoc.aPropos : richTextToPlainText(sanitizedDoc.aPropos),
      conseil: typeof sanitizedDoc.conseil === 'string' ? sanitizedDoc.conseil : richTextToPlainText(sanitizedDoc.conseil),
      pyramideOlfactive: {
        head: Array.isArray(sanitizedDoc.notesDepart) ? sanitizedDoc.notesDepart.map((n: any) => n?.note || '') : [],
        heart: Array.isArray(sanitizedDoc.notesCoeur) ? sanitizedDoc.notesCoeur.map((n: any) => n?.note || '') : [],
        base: Array.isArray(sanitizedDoc.notesFond) ? sanitizedDoc.notesFond.map((n: any) => n?.note || '') : []
      },
      tags: [],
    };
    
    // Log pour déboggage
    console.log(`Produit sanitisé pour ${id}:`, JSON.stringify(product, null, 2));
    
    return { props: { product }, revalidate: 60 };
  } catch (err) {
    console.error('Erreur lors de la récupération du produit:', err);
    return { props: { product: null, error: 'Erreur lors du chargement du produit' }, revalidate: 60 };
  }
};