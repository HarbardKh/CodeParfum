import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import type { Product } from '../../types/product';
import { fetchData } from '@/services/apiService';

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

interface ProductListProps {
  products: Product[];
}

export default function ProductListPage({ products }: ProductListProps) {
  // Grouper les parfums par genre
  const femmeParfums = products.filter(p => p.gender === 'F');
  const hommeParfums = products.filter(p => p.gender === 'H');

  return (
    <Layout title="Tous nos parfums - CodeParfum.fr">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-primary-900 mb-8 text-center">
          Tous nos parfums d'exception
        </h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-medium text-primary-800 mb-6">Parfums pour Femme</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {femmeParfums.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-medium text-primary-800 mb-6">Parfums pour Homme</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {hommeParfums.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produit/${product.reference || product.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="bg-gray-100 h-52 overflow-hidden">
          <img 
            src={`/images/products/${product.reference || product.id}.jpg`}
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/images/placeholder.jpg';
            }}
          />
        </div>
        <div className="p-4">
          <div className="flex items-center mb-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.gender === 'H' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
              {product.gender === 'H' ? 'Homme' : 'Femme'}
            </span>
            {product.famille_olfactive && (
              <span className="ml-2 text-xs text-gray-500">{product.famille_olfactive}</span>
            )}
          </div>
          
          <h3 className="font-serif font-medium text-primary-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description ? `${product.description.substring(0, 80)}...` : 'Détails à venir...'}
          </p>
          
          <div className="flex justify-between items-center mt-3">
            <p className="font-medium text-primary-900">{product.price}€</p>
            {product.volume && (
              <p className="text-sm text-gray-500">{product.volume}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Récupération des parfums depuis l'API avec une limite réduite
    const { data, error } = await fetchData<PaginatedResponse<any>>(
      '/api/parfums',
      {
        params: {
          limit: 40, // Réduit de 100 à 40 pour éviter les erreurs 429 (rate limiting)
          depth: 1,
          sort: '-updatedAt' // Priorité aux produits récemment mis à jour
        }
      }
    );
    
    if (error || !data) {
      console.error('Erreur lors de la récupération des parfums:', error);
      return { props: { products: [] }, revalidate: 60 };
    }
    
    console.log(`Récupération de ${data.docs.length} produits pour la page index`);
    
    // Transformer les données de l'API en objets Product
    // Avec des valeurs par défaut explicites pour éviter les `undefined` qui ne sont pas sérialisables
    const products = data.docs.map((doc: any) => ({
      id: doc.id || '',
      reference: doc.reference || null, // Utiliser null au lieu de undefined
      slug: doc.slug || '',
      name: doc.nom || '',
      price: typeof doc.prix === 'number' ? doc.prix : 0,
      gender: doc.genre || 'U',
      volume: doc.volume || '',
      famille_olfactive: doc.familleOlfactive?.nom || '',
      intensite: doc.intensite || '',
      description: typeof doc.description === 'string' ? doc.description : '',
      createdAt: doc.createdAt || null,
      updatedAt: doc.updatedAt || null
    }));
    
    return {
      props: {
        products
      },
      revalidate: 60 // Revalider les données toutes les 60 secondes
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des parfums:', error);
    return {
      props: {
        products: []
      },
      revalidate: 60
    };
  }
};