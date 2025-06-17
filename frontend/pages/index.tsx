import { GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import ParfumCard from '@/components/parfums/ParfumCard';
import { fetchData } from '@/services/apiService';
import LogService from '../src/services/logService';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { transformImageUrl } from '@/lib/imageUtils';

// Type pour un parfum
interface Parfum {
  id: string;
  nom: string;
  slug: string;
  reference: string;
  prix: number | string;
  familleOlfactive: string | { nom?: string; id?: string };
  genre?: string;
  nouveaute?: boolean;
  bestSeller?: boolean;
  image?: {
    url?: string;
    alt?: string;
  };
  numeroParf?: string;
}

// Type pour la configuration du site
interface SiteConfig {
  slogan: string;
  descriptionAccueil: string;
  miseEnAvant: {
    titre: string;
    description: string;
  };
}

interface HomeProps {
  parfumsMisEnAvant: Parfum[];
  heroImage: {
    url?: string | null;
    alt?: string;
    sizes?: {
      hero?: {
        url?: string | null;
        width?: number | null;
        height?: number | null;
      };
      thumbnail?: {
        url?: string | null;
      };
      card?: {
        url?: string | null;
      };
    } | null;
  } | null;
  heroImageMobile?: {
    url?: string | null;
    alt?: string;
    sizes?: {
      hero?: {
        url?: string | null;
        width?: number | null;
        height?: number | null;
      };
      thumbnail?: {
        url?: string | null;
      };
      card?: {
        url?: string | null;
      };
    } | null;
  } | null;
  conseillerVirtuelImage: {
    url: string;
    alt: string;
  };
  siteConfig: SiteConfig;
}

// Données du catalogue réel
const catalogParfums: Parfum[] = [
  { 
    id: '1', 
    nom: 'N°6', 
    slug: 'parfum-6', 
    reference: '006', 
    prix: 35.00, 
    familleOlfactive: 'Orientale', 
    genre: 'Femme', 
    bestSeller: true, 
    nouveaute: false,
    image: {
      url: '/images/parfums/006.jpg',
      alt: 'Parfum N°6'
    }
  },
  { 
    id: '2', 
    nom: 'N°140', 
    slug: 'parfum-140', 
    reference: '140', 
    prix: 35.00, 
    familleOlfactive: 'Aromatique', 
    genre: 'Homme', 
    bestSeller: true, 
    nouveaute: false,
    image: {
      url: '/images/parfums/140.jpg',
      alt: 'Parfum N°140'
    }
  },
  { 
    id: '3', 
    nom: 'N°7', 
    slug: 'parfum-7', 
    reference: '007', 
    prix: 35.00, 
    familleOlfactive: 'Florale', 
    genre: 'Femme', 
    bestSeller: true, 
    nouveaute: false,
    image: {
      url: '/images/parfums/007.jpg',
      alt: 'Parfum N°7'
    }
  },
  { 
    id: '4', 
    nom: 'N°213', 
    slug: 'parfum-213', 
    reference: '213', 
    prix: 35.00, 
    familleOlfactive: 'Florale Fruité', 
    genre: 'Femme', 
    bestSeller: false, 
    nouveaute: true,
    image: {
      url: '/images/parfums/213.jpg',
      alt: 'Parfum N°213'
    }
  },
  { 
    id: '5', 
    nom: 'N°243', 
    slug: 'parfum-243', 
    reference: '243', 
    prix: 35.00, 
    familleOlfactive: 'Boisée', 
    genre: 'Homme', 
    bestSeller: false, 
    nouveaute: true,
    image: {
      url: '/images/parfums/243.jpg',
      alt: 'Parfum N°243'
    }
  },
  { 
    id: '6', 
    nom: 'N°277', 
    slug: 'parfum-277', 
    reference: '277', 
    prix: 35.00, 
    familleOlfactive: 'Aromatique', 
    genre: 'Homme', 
    bestSeller: false, 
    nouveaute: true,
    image: {
      url: '/images/parfums/277.jpg',
      alt: 'Parfum N°277'
    }
  },
];

// Configuration par défaut du site
const defaultSiteConfig: SiteConfig = {
  slogan: "Découvrez nos parfums d'exception, créés avec passion et expertise.",
  descriptionAccueil: "Laissez-vous guider à travers notre sélection de parfums de qualité à prix justes,<br /> et explorez les grandes familles olfactives pour révéler votre personnalité à travers une signature olfactive singulière.",
  miseEnAvant: {
    titre: "Notre sélection du moment",
    description: "Découvrez nos parfums les plus populaires"
  }
};

// Fonction pour formater le prix
const formatPrice = (price: any): string => {
  if (typeof price === 'number') {
    return price.toFixed(2) + ' €';
  }
  return price ? String(price) + ' €' : '0.00 €';
};

// Fonction pour obtenir le nom de la famille olfactive
const getFamilleNom = (famille: any): string => {
  if (typeof famille === 'string') {
    return famille;
  }
  if (famille && typeof famille === 'object') {
    return famille.nom || famille.id || 'Non spécifiée';
  }
  return 'Non spécifiée';
};

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

// Interface pour l'image héro
interface HeroImage {
  id: string;
  filename: string;
  url: string;
  alt?: string;
  sizes?: {
    hero?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    };
    thumbnail?: {
      url?: string | null;
    };
    card?: {
      url?: string | null;
    };
  }
}

export default function Home({ parfumsMisEnAvant, heroImage, heroImageMobile, conseillerVirtuelImage, siteConfig }: HomeProps) {
  return (
    <Layout title="CodeParfum.fr - Parfums d'exception">
      {/* Hero section hybride avec image dédiée pour mobile */}
      <div className="bg-[#0C0C0C] text-white">
        {/* Version mobile - Image "Hero-1-Mobile" + texte en dessous */}
        <div className="lg:hidden flex flex-col">
          {/* Image mobile dédiée, centrée sur les flacons */}
          <div className="relative h-[50vh] min-h-[350px]">
            {/* Utiliser directement l'image statique pour mobile */}
            <ImageWithFallback
              src="/images/hero/chogan-hero-mobile.jpg"
              alt="Collection de parfums Chogan - Mobile"
              fill
              className="object-cover object-center w-full h-full"
              priority
              fallbackSrc="/images/hero/chogan-bnw.jpg"
            />
            {/* Pas de surcouche sombre */}
          </div>

          {/* Texte et boutons en-dessous sur fond noir */}
          <div className="py-8 px-6 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-[1px] bg-[#C7A13E] mb-4 mx-auto"></div>
              <p className="text-xl text-[#C7A13E] font-serif mb-4">
                Découvrez nos parfums d'exception,<br />
                créés avec passion et expertise.
              </p>
              <div className="w-16 h-[1px] bg-[#C7A13E] mt-4 mb-6 mx-auto"></div>

              {/* Boutons CTA */}
              <div className="mt-6 flex flex-col items-center gap-4">
                <Link href="/parfums" className="inline-block bg-[#B78846] hover:bg-[#C7A13E] text-white py-3 px-6 rounded-md transition-colors duration-300 text-base uppercase tracking-wider font-medium shadow-md">
                  Découvrir nos parfums
                </Link>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link href="/familles-olfactives" className="inline-block border-2 border-[#C7A13E] bg-[#C7A13E]/10 text-[#C7A13E] font-bold hover:bg-[#C7A13E]/80 hover:text-white py-2 px-4 rounded-full transition-colors duration-300 text-sm uppercase tracking-wider shadow-md whitespace-nowrap">
                    Familles Olfactives
                  </Link>
                  <Link href="/conseiller-vip" className="inline-block border-2 border-[#C7A13E] bg-[#C7A13E]/10 text-[#C7A13E] font-bold hover:bg-[#C7A13E]/80 hover:text-white py-2 px-4 rounded-full transition-colors duration-300 text-sm uppercase tracking-wider shadow-md whitespace-nowrap">
                    Conseiller Virtuel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version desktop - Exactement comme avant, inchangée */}
        <div className="hidden lg:block relative overflow-hidden">
          <div className="absolute inset-0">
            <ImageWithFallback
              src="/images/hero/chogan-hero-desktop.jpg"
              alt="Parfums CHOGAN Noir et Blanc"
              fill
              className="object-cover object-left w-full"
              priority
              fallbackSrc="/images/hero/chogan-bnw.jpg"
            />
            {/* Gradient sur desktop uniquement */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0C]/40 via-transparent to-[#0C0C0C]/70" />
          </div>
          <div className="relative h-[70vh] min-h-[550px] max-h-[800px]">
            {/* Positionnement original du bloc de contenu identique au premier screenshot */}
            <div className="absolute top-1/2 left-1/2 md:top-[55%] md:left-[77%] transform -translate-x-1/2 -translate-y-1/2 md:-translate-y-1/3 flex flex-col items-center px-4 w-full md:w-auto max-w-sm md:max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center w-full px-4 md:px-0"
              >
                <div className="w-16 md:w-24 h-[1px] bg-[#C7A13E] mb-4 md:mb-8 mx-auto"></div>
                <p className="text-xl md:text-2xl text-[#C7A13E] font-serif [text-shadow:_0_2px_3px_rgb(0_0_0_/_95%)]">
                  {siteConfig.slogan}
                </p>
                <div className="w-16 md:w-24 h-[1px] bg-[#C7A13E] mt-4 md:mt-8 mb-4 md:mb-8 mx-auto"></div>
              </motion.div>

              {/* Bouton CTA - Exactement comme avant */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col items-center gap-4"
              >
                <Link href="/parfums" className="inline-block bg-[#B78846] hover:bg-[#C7A13E] text-white py-3 px-6 md:py-2 md:px-5 rounded-md transition-colors duration-300 text-base md:text-sm uppercase tracking-wider font-medium">
                  Découvrir nos parfums
                </Link>
                <div className="flex gap-4">
                  <Link href="/familles-olfactives" className="inline-block border-2 border-[#C7A13E] bg-[#C7A13E]/10 text-[#C7A13E] font-bold hover:bg-[#C7A13E]/80 hover:text-white py-2 px-5 rounded-full transition-colors duration-300 text-base md:text-sm uppercase tracking-wider shadow-md whitespace-nowrap">
                    Familles Olfactives
                  </Link>
                  <Link href="/conseiller-vip" className="inline-block border-2 border-[#C7A13E] bg-[#C7A13E]/10 text-[#C7A13E] font-bold hover:bg-[#C7A13E]/80 hover:text-white py-2 px-5 rounded-full transition-colors duration-300 text-base md:text-sm uppercase tracking-wider shadow-md whitespace-nowrap">
                    Conseiller Virtuel
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Section "Un voyage olfactif..." */}
      <section className="bg-[#1E1E2D] text-white py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-serif text-[#C7A13E] mb-4 md:mb-6"
          >
            Un voyage olfactif à la croisée des senteurs
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl max-w-5xl mx-auto"
            dangerouslySetInnerHTML={{ __html: siteConfig.descriptionAccueil }}
          >
          </motion.p>
        </div>
      </section>

      {/* Section Notre sélection du moment */}
      <section className="py-12 md:py-16 bg-gray-300">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-10 md:mb-12"
          >
            {siteConfig.miseEnAvant.titre}
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
            {parfumsMisEnAvant.slice(0, 3).map((parfum, index) => (
              <motion.div
                key={parfum.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                className="w-full"
              >
                <ParfumCard parfum={parfum} />
              </motion.div>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link href="/parfums" className="inline-block bg-[#1E1E2D] text-white text-lg font-medium py-3 px-10 rounded-md hover:bg-[#C7A13E] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Voir tout le catalogue
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Section Conseiller VIP */}
      <section className="py-8 md:py-16 bg-[#1E1E2D] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left md:pr-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-serif mb-6 text-[#C7A13E]"
              >
                Besoin de conseils personnalisés ?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl mb-8 leading-relaxed"
              >
                Notre conseiller virtuel vous aide à trouver le parfum idéal qui correspond à vos goûts et à votre personnalité.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/conseiller-vip" className="inline-block bg-[#B78846] hover:bg-[#C7A13E] text-white py-3 px-6 md:py-2 md:px-5 rounded-md transition-colors duration-300 text-base md:text-sm uppercase tracking-wider font-medium">
                  Obtenir un conseil
                </Link>
              </motion.div>
            </div>
            <div className="md:w-1/2 relative h-[300px] md:h-[450px] w-full flex justify-center items-center">
              {/* Image du conseiller en statique */}
              <ImageWithFallback
                src="/images/conseiller-virtuel.jpg" 
                alt="Conseiller virtuel parfums" 
                width={675}
                height={450}
                className="object-contain rounded-lg shadow-lg max-h-[300px] md:max-h-[450px]"
                fallbackSrc="/images/parfums-chogan.jpg" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Familles Olfactives - Améliorée */}
      <section className="py-12 md:py-16 bg-gray-300">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-6">
              Comprendre les Familles Olfactives : La Clé de Vos Préférences
            </h2>
            <p className="mt-4 text-center text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Chaque parfum appartient à une ou plusieurs familles olfactives, comme un vin à son terroir ou une chanson à son style musical. Apprendre à les reconnaître, c'est affiner son goût, comprendre ce qui nous plaît… et mieux choisir ce qui nous ressemble.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 md:mt-12 w-full overflow-x-auto py-4"
          >
            <div className="flex flex-nowrap justify-start md:justify-center gap-x-3 pl-8 pr-4 md:pl-4 md:flex-wrap md:gap-3 min-w-full w-full">
              {/* La valeur pl-8 assure que le premier bouton est complètement visible sur mobile */}
              {[
                { name: 'Florale', href: '/familles-olfactives/florale', bgColor: 'bg-pink-600', hoverColor: 'hover:bg-pink-700', icon: '🌸' },
                { name: 'Boisée', href: '/familles-olfactives/boisee', bgColor: 'bg-emerald-600', hoverColor: 'hover:bg-emerald-700', icon: '🌳' },
                { name: 'Orientale', href: '/familles-olfactives/orientale', bgColor: 'bg-amber-600', hoverColor: 'hover:bg-amber-700', icon: '🔥' },
                { name: 'Hespéridée', href: '/familles-olfactives/hesperidee', bgColor: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600', icon: '🍊' },
                { name: 'Chyprée', href: '/familles-olfactives/chypree', bgColor: 'bg-purple-600', hoverColor: 'hover:bg-purple-700', icon: '🌼' },
                { name: 'Fougère', href: '/familles-olfactives/fougere', bgColor: 'bg-green-600', hoverColor: 'hover:bg-green-700', icon: '🌾' },
                { name: 'Aromatique', href: '/familles-olfactives/aromatique', bgColor: 'bg-teal-600', hoverColor: 'hover:bg-teal-700', icon: '🌿' },
              ].map((famille, index) => (
                <Link key={famille.name} href={famille.href} className={`flex-shrink-0 group relative rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 opacity-60 hover:opacity-100 transition-opacity`}>
                  <div className={`absolute inset-0 ${famille.bgColor} rounded-lg group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative z-10 p-4 text-center min-w-[140px]">
                    <span className="text-4xl mb-2 inline-block group-hover:scale-110 transition-transform">{famille.icon}</span>
                    <h3 className="text-lg font-semibold text-white [text-shadow:_0_1px_2px_rgb(0_0_0_/_50%)]">{famille.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link href="/familles-olfactives" className="inline-block bg-[#1E1E2D] text-white text-lg font-medium py-3 px-10 rounded-md hover:bg-[#C7A13E] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Découvrir toutes les familles
            </Link>
          </motion.div>
        </div>
      </section>

    </Layout>
  );
}

// Utilitaire pour transformer les URLs lors du build SSR/SSG
function serverSideTransformImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // URL de production codée en dur pour Vercel
  const SERVER_URL = 'https://projet-chogan-mvp.onrender.com';
  
  // Si l'URL est complète avec localhost:3002, la remplacer
  if (url.includes('localhost:3002')) {
    return url.replace('http://localhost:3002', SERVER_URL);
  }
  
  // Si l'URL est relative (/uploads/), ajouter l'URL du serveur
  if (url.startsWith('/uploads/')) {
    return `${SERVER_URL}${url}`;
  }
  
  return url;
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Calculer la date actuelle arrondie à 3 jours pour la stabilité de la sélection
    const currentDate = new Date();
    const daysSinceEpoch = Math.floor(currentDate.getTime() / (1000 * 60 * 60 * 24)); // Nombre de jours depuis le 1er janvier 1970
    const periodNumber = Math.floor(daysSinceEpoch / 3); // Change tous les 3 jours
    
    // Définir l'URL de l'API en priorité selon les variables d'environnement
    const MAIN_API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://projet-chogan-mvp.onrender.com';
    
    const apiUrls = [
      MAIN_API_URL,
      'http://localhost:3002',
      'http://127.0.0.1:3002',
    ].filter(Boolean);
    
    // Récupération de l'image Hero desktop depuis l'API
    let heroImage = null;
    // Récupération de l'image Hero mobile depuis l'API
    let heroImageMobile = null;
    // Image du conseiller virtuel (sera utilisée dans les props)
    const conseillerVirtuelImage = {
      url: "https://projet-chogan-mvp.onrender.com/uploads/Conseiller%20Virtuel.png",
      alt: "Conseiller Virtuel"
    };
    
    for (const apiUrl of apiUrls) {
      try {
        LogService.debug(`Tentative de récupération des images hero depuis: ${apiUrl}`);
        
        // Récupération de l'image hero desktop
        const { data, error } = await fetchData<PaginatedResponse<HeroImage>>(
          `/api/media?where[filename][equals]=Hero-1.png`,
          {
            baseURL: apiUrl,
          }
        );
        
        if (!error && data && data.docs && data.docs.length > 0) {
          heroImage = data.docs[0];
          LogService.info("Image Hero desktop récupérée avec succès");
        }
        
        // Récupération de l'image hero mobile
        const { data: dataMobile, error: errorMobile } = await fetchData<PaginatedResponse<HeroImage>>(
          `/api/media?where[alt][equals]=Hero1Mobile`,
          {
            baseURL: apiUrl,
          }
        );
        
        if (!errorMobile && dataMobile && dataMobile.docs && dataMobile.docs.length > 0) {
          heroImageMobile = dataMobile.docs[0];
          LogService.info("Image Hero mobile récupérée avec succès");
        }
        
        if (heroImage && heroImageMobile) {
          break; // Si les deux images sont récupérées, on sort de la boucle
        }
      } catch (err) {
        LogService.warn(`Échec de récupération des images Hero depuis: ${apiUrl}`, err);
      }
    }
    
    // Récupération des parfums depuis l'API ou utilisation des données en dur
    let parfums = [];
    try {
      // Essayer de récupérer tous les parfums depuis l'API
      let fetchedParfums = null;
      
      for (const apiUrl of apiUrls) {
        try {
          LogService.debug(`Tentative de récupération des parfums depuis: ${apiUrl}`);
          
          const { data, error } = await fetchData<PaginatedResponse<Parfum>>(
            `/api/parfums?limit=300&sort=numeroParf`,
            {
              baseURL: apiUrl,
            }
          );
          
          if (error) throw new Error(`Échec de la réponse API: ${error.message}`);
          
          if (data && data.docs && data.docs.length > 0) {
            fetchedParfums = data.docs;
            LogService.info(`Récupération réussie de ${fetchedParfums.length} parfums`);
            break;
          }
        } catch (err) {
          LogService.warn(`Échec de connexion à l'API: ${apiUrl}`, err);
        }
      }
      
      parfums = fetchedParfums || catalogParfums;
      
    } catch (error) {
      LogService.warn("Erreur lors de la récupération des parfums via l'API:", error);
      parfums = catalogParfums; // Fallback sur le catalogue en dur
    }
    
    // S'assurer que nous avons au moins le catalogue en dur
    if (!parfums || parfums.length === 0) {
      parfums = catalogParfums;
    }
    
    // Fonction pour mélanger un tableau de manière déterministe en utilisant la période comme graine
    const deterministicShuffle = (array: Parfum[], seed: number) => {
      // Copie du tableau pour ne pas modifier l'original
      const shuffled = [...array];
      
      // Algorithme Fisher-Yates avec graine déterministe
      let currentIndex = shuffled.length;
      let temporaryValue, randomIndex;
      
      // Fonction pseudo-aléatoire déterministe basée sur une graine
      const seededRandom = (seed: number, index: number): number => {
        const x = Math.sin(seed + index) * 10000;
        return x - Math.floor(x);
      };
      
      // Mélange du tableau
      while (currentIndex !== 0) {
        randomIndex = Math.floor(seededRandom(seed, currentIndex) * currentIndex);
        currentIndex -= 1;
        
        // Échange
        temporaryValue = shuffled[currentIndex];
        shuffled[currentIndex] = shuffled[randomIndex];
        shuffled[randomIndex] = temporaryValue;
      }
      
      return shuffled;
    };
    
    // Sélection des parfums mis en avant (3 à 6 parfums)
    const selectionSize = 6; // Nombre de parfums à afficher
    const shuffledParfums = deterministicShuffle(parfums, periodNumber);
    const selectionDuMoment = shuffledParfums.slice(0, selectionSize);
    
    LogService.debug(`Sélection du moment générée pour la période ${periodNumber} (change tous les 3 jours)`);
    
    // Transformation des parfums pour assurer la compatibilité avec le rendu
    const parfumsTransformed = selectionDuMoment.map(parfum => {
      // Déterminer l'image par défaut en fonction du genre
      let defaultImageUrl;
      if (parfum.genre === 'F') {
        defaultImageUrl = '/images/placeholders/femme.jpg';
      } else if (parfum.genre === 'H') {
        defaultImageUrl = '/images/placeholders/homme.jpg';
      } else {
        defaultImageUrl = '/images/placeholder.jpg';
      }

      return {
        id: parfum.id,
        nom: `N°${parfum.numeroParf || parfum.reference || parfum.id}`,
        slug: `ref-${parfum.numeroParf || parfum.reference || parfum.id}`,
        reference: parfum.numeroParf || parfum.reference || parfum.id,
        prix: parfum.prix || 35.00,
        familleOlfactive: parfum.familleOlfactive || 'Non classé',
        genre: parfum.genre === 'F' ? 'Femme' : parfum.genre === 'H' ? 'Homme' : 'Unisexe',
        nouveaute: parfum.nouveaute || false,
        bestSeller: parfum.bestSeller || false,
        image: {
          // Utiliser l'URL de l'image si elle existe, sinon utiliser l'image par défaut
          url: parfum.image?.url || defaultImageUrl,
          alt: `Parfum ${parfum.numeroParf || parfum.reference || parfum.id}`
        }
      };
    });
    
    // Transformation des URLs d'images pour le rendu SSR/SSG
    // Ceci garantit que les URLs sont correctes lors du build
    return {
      props: {
        parfumsMisEnAvant: parfumsTransformed.map(parfum => ({
          ...parfum,
          image: {
            ...parfum.image,
            url: serverSideTransformImageUrl(parfum.image.url)
          }
        })),
        heroImage: heroImage ? {
          url: serverSideTransformImageUrl(heroImage.url),
          alt: heroImage.alt || 'Hero',
          sizes: heroImage.sizes || null
        } : null,
        heroImageMobile: heroImageMobile ? {
          url: serverSideTransformImageUrl(heroImageMobile.url),
          alt: heroImageMobile.alt || 'Hero1Mobile',
          sizes: heroImageMobile.sizes || null
        } : null,
        conseillerVirtuelImage: {
          url: "https://projet-chogan-mvp.onrender.com/uploads/Conseiller%20Virtuel.png",
          alt: conseillerVirtuelImage.alt || 'Conseiller Virtuel'
        },
        siteConfig: {
          ...defaultSiteConfig,
          miseEnAvant: {
            titre: "Notre sélection du moment",
            description: "Découvrez notre sélection de parfums du moment"
          }
        }
      },
      revalidate: 60 * 60 // Revalider le contenu toutes les heures
    };
  } catch (error) {
    LogService.error('Erreur dans getStaticProps:', error);
    
    // En cas d'erreur globale, utiliser les données par défaut
    return {
      props: {
        parfumsMisEnAvant: catalogParfums.slice(0, 6),
        heroImage: null,
        siteConfig: defaultSiteConfig
      },
      revalidate: 60 // 1 minute en cas d'erreur
    };
  }
}
