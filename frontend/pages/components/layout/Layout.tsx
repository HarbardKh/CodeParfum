import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';

// Composant Header
const Header = () => {
  const { itemCount } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Détection du scroll pour adapter le header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-30 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-serif font-bold text-primary-600">Codeparfum</span>
          </Link>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/catalogue" className={`nav-link ${router.pathname.includes('/catalogue') ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'}`}>
              Catalogue
            </Link>
            <Link href="/guide-conseil" className={`nav-link ${router.pathname.includes('/guide-conseil') ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'}`}>
              Guide & Conseil
            </Link>
            <Link href="/apropos" className={`nav-link ${router.pathname === '/apropos' ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-primary-600'}`}>
              À propos
            </Link>
          </nav>
          
          {/* Menu actions (panier, etc.) */}
          <div className="flex items-center space-x-4">
            <Link href="/panier" className="relative p-2">
              <span className="sr-only">Panier</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* Bouton menu mobile */}
            <button 
              type="button" 
              className="md:hidden rounded-md p-2 text-gray-600 hover:text-primary-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link href="/catalogue" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-md">
              Catalogue
            </Link>
            <Link href="/guide-conseil" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-md">
              Guide & Conseil
            </Link>
            <Link href="/apropos" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary-600 rounded-md">
              À propos
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

// Composant Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne 1 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Codeparfum</h3>
            <p className="text-gray-300 mb-4">
              Notre passion est de créer des parfums d'exception, accessibles à tous.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Colonne 2 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalogue" className="text-gray-300 hover:text-white">
                  Catalogue de parfums
                </Link>
              </li>
              <li>
                <Link href="/guide-conseil" className="text-gray-300 hover:text-white">
                  Guide & Conseil
                </Link>
              </li>
              <li>
                <Link href="/apropos" className="text-gray-300 hover:text-white">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-gray-300 hover:text-white">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Colonne 3 */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <address className="not-italic text-gray-300">
              <p className="mb-2">Codeparfum</p>
              <p className="mb-2">contact@atelier-olfactif.fr</p>
              <p className="mb-2">Paris, France</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Codeparfum. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

// Composant pour l'arrière-plan décoratif
const DecorativeBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-24 right-0 w-96 h-96 bg-primary-100 rounded-full opacity-20 transform translate-x-1/2"></div>
      <div className="absolute top-1/3 -left-24 w-80 h-80 bg-secondary-100 rounded-full opacity-20 transform -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-100 rounded-full opacity-20"></div>
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title = "Codeparfum" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Découvrez notre collection de parfums d'exception" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Script de tracking Umami Analytics - RGPD-friendly */}
      <Script
        async
        defer
        data-website-id="VOTRE-ID-DE-SITE-UMAMI"
        src="https://analytics.umami.is/script.js"
        data-domains="votredomaine.com"
        strategy="afterInteractive"
      />

      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Arrière-plan décoratif global */}
        <DecorativeBackground />
        
        {mounted && (
          <>
            <Header />
            <main className="flex-grow relative z-10">
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
            <Footer />
          </>
        )}
      </div>
    </>
  );
};

export default Layout; 