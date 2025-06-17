import React, { ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/router';
import CookieConsent from '../ui/CookieConsent';

// Composants pour l'en-tête amélioré
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
  
  // Vérifier si un lien est actif
  const isActiveLink = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };
  
  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 bg-[#0C0C0C] shadow-lg ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="container mx-auto px-3 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Nom du site - même version sur tous les écrans */}
          <Link href="/" className="py-1 sm:py-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-logo font-bold text-[#C7A13E] hover:text-[#d8b250] transition-colors">
            <span className="block">CodeParfum.fr</span>
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex space-x-3 lg:space-x-6">
            <Link href="/" className={`text-[#C7A13E] hover:text-[#d8b250] transition-colors ${isActiveLink('/') ? 'border-b-2 border-[#C7A13E]' : ''}`}>
              Accueil
            </Link>
            <Link href="/parfums" className={`text-[#C7A13E] hover:text-[#d8b250] transition-colors ${isActiveLink('/parfums') ? 'border-b-2 border-[#C7A13E]' : ''}`}>
              Parfums
            </Link>
            <Link href="/familles-olfactives" className={`whitespace-nowrap text-[#C7A13E] hover:text-[#d8b250] transition-colors ${isActiveLink('/familles-olfactives') ? 'border-b-2 border-[#C7A13E]' : ''}`}>
              Familles Olfactives
            </Link>
            <Link href="/conseillerVIP" className={`text-[#C7A13E] hover:text-[#d8b250] transition-colors ${isActiveLink('/conseillerVIP') ? 'border-b-2 border-[#C7A13E]' : ''}`}>
              Conseiller VIP
            </Link>
          </nav>
          
          {/* Actions utilisateur */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/panier" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C7A13E] hover:text-[#d8b250] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#C7A13E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="block md:hidden p-2"
              aria-label="Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C7A13E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Menu mobile - overlay fullscreen pour une meilleure expérience */}
        <div className={`md:hidden fixed inset-0 bg-black bg-opacity-95 z-50 transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-logo font-bold text-[#C7A13E]">
                CodeParfum.fr
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2"
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C7A13E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col items-center justify-center flex-grow space-y-6 p-4">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/parfums', label: 'Parfums' },
                { href: '/familles-olfactives', label: 'Familles Olfactives' },
                { href: '/conseillerVIP', label: 'Conseiller VIP' },
                { href: '/panier', label: 'Panier' },
              ].map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-xl text-center text-[#C7A13E] hover:text-[#d8b250] transition-colors w-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

// Composant pour le pied de page
const Footer = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Effet pour détecter la largeur d'écran côté client uniquement
  useEffect(() => {
    // Vérifie si la fenêtre est disponible (côté client)
    setIsDesktop(window.innerWidth >= 768);
    
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gère les accordions sur mobile
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Composant pour les titres de section du footer (avec accordions sur mobile)
  const FooterSectionTitle = ({ title, section }: { title: string; section: string }) => (
    <div className="flex items-center justify-between">
      <h3 className="text-lg md:mb-4 text-[#C7A13E] tracking-wide font-semibold">{title}</h3>
      <button 
        className="md:hidden text-[#C7A13E] p-1" 
        onClick={() => toggleSection(section)}
        aria-label={`Afficher/Masquer ${title}`}
      >
        {expandedSection === section ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );

  return (
    <footer className="bg-[#0C0C0C] text-[#C7A13E] pt-6 md:pt-10 shadow-inner relative pb-6 md:pb-10 mt-12 md:mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 md:gap-10">
          {/* Section principale - toujours visible */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-serif mb-4 text-[#C7A13E] tracking-wide font-semibold">CODE<br />PARFUM</h3>
            <p className="text-sm mb-4 text-[#C7A13E]/80">
              Des parfums de haute qualité inspirés des plus grandes fragrances, à des prix accessibles.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-[#C7A13E] hover:text-[#d8b250] transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" className="text-[#C7A13E] hover:text-[#d8b250] transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Sections accordéon sur mobile, normales sur desktop */}
          <div className="border-t sm:border-t-0 border-gray-800 py-2 md:py-0">
            <FooterSectionTitle title="PARFUMS" section="parfums" />
            <ul className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'parfums' || isDesktop ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 md:max-h-48 md:opacity-100 md:mt-2'}`}>
              <li><Link href="/parfums?genre=H" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Homme</Link></li>
              <li><Link href="/parfums?genre=F" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Femme</Link></li>
              <li><Link href="/parfums" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Tout</Link></li>
            </ul>
          </div>
          
          <div className="border-t sm:border-t-0 border-gray-800 py-2 md:py-0">
            <FooterSectionTitle title="À PROPOS" section="apropos" />
            <ul className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'apropos' || isDesktop ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 md:max-h-48 md:opacity-100 md:mt-2'}`}>
              <li><Link href="/a-propos#notre-histoire" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Notre Histoire</Link></li>
              <li><Link href="/a-propos#histoire-chogan" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">L&apos;Histoire de Chogan</Link></li>
              <li><Link href="/a-propos#notre-engagement" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Notre Engagement</Link></li>
            </ul>
          </div>
          
          <div className="border-t sm:border-t-0 border-gray-800 py-2 md:py-0">
            <FooterSectionTitle title="SERVICE CLIENT" section="service" />
            <ul className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'service' || isDesktop ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 md:max-h-48 md:opacity-100 md:mt-2'}`}>
              <li><Link href="/service-client#contact" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Contact</Link></li>
              <li><Link href="/service-client#livraison" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Livraison</Link></li>
              <li><Link href="/service-client#suivi-commande" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Suivi de commande</Link></li>
              <li><Link href="/service-client#faq" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="border-t sm:border-t-0 border-gray-800 py-2 md:py-0">
            <FooterSectionTitle title="INFOS & CONDITIONS" section="infos" />
            <ul className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${expandedSection === 'infos' || isDesktop ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0 md:max-h-48 md:opacity-100 md:mt-2'}`}>
              <li><Link href="/infos-conditions#mentions-legales" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Mentions légales</Link></li>
              <li><Link href="/infos-conditions#confidentialite" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">Confidentialité</Link></li>
              <li><Link href="/infos-conditions#cgv" className="text-[#C7A13E]/90 hover:text-[#d8b250] transition-colors block py-1">CGV</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 md:mt-8 pt-4 md:pt-5 border-t border-gray-700/50 text-center text-[#C7A13E]/60 relative z-10">
          <p>&copy; {new Date().getFullYear()} CodeParfum.fr. Tous droits réservés.</p>
        </div>
      </div>
      {/* Dégradé pleine largeur sous la barre de copyright */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-800 to-transparent z-0"></div>
    </footer>
  );
};

// Type pour les props du composant Layout
interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

// Composant Layout principal
const Layout = ({ children, title = "CodeParfum.fr - Parfums d'exception", description = "Découvrez notre collection de parfums d'exception, créés avec passion et expertise pour vous offrir une expérience olfactive unique." }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-300 font-sans">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      <div className="min-h-screen flex flex-col">
        {/* Marge supplémentaire pour compenser le header fixe */}
        <div className="pt-16 sm:pt-20"></div>
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
      <CookieConsent />
    </div>
  );
};

export default Layout;
