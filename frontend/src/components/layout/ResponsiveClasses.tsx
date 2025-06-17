import { useEffect, useState } from 'react';

// Définir les breakpoints en accord avec Tailwind CSS
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Hook pour détecter la taille de l'écran
export const useScreenSize = () => {
  // Valeur par défaut côté serveur
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    // Définir la taille initiale
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg
      });
    };

    // Ajouter l'event listener
    window.addEventListener('resize', updateSize);
    
    // Appel initial
    updateSize();

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return screenSize;
};

// Utilitaire pour générer des classes conditionnelles selon la taille d'écran
type ResponsiveClassesProps = {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
};

export const getResponsiveClasses = ({
  base = '',
  sm = '',
  md = '',
  lg = '',
  xl = '',
  '2xl': xxl = ''
}: ResponsiveClassesProps): string => {
  return `${base} 
    ${sm ? `sm:${sm}` : ''} 
    ${md ? `md:${md}` : ''} 
    ${lg ? `lg:${lg}` : ''} 
    ${xl ? `xl:${xl}` : ''} 
    ${xxl ? `2xl:${xxl}` : ''}`.trim().replace(/\s+/g, ' ');
};

// Composant qui rend accessible les classes de taille d'écran via props
type ResponsiveWrapperProps = {
  children: (screenClasses: {
    className: string;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }) => React.ReactNode;
  className?: string;
};

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  
  // Ajouter les classes conditionnelles basées sur la taille de l'écran
  const screenClasses = {
    className: `${className} ${isMobile ? 'is-mobile' : ''} ${isTablet ? 'is-tablet' : ''} ${isDesktop ? 'is-desktop' : ''}`.trim(),
    isMobile,
    isTablet,
    isDesktop
  };
  
  return <>{children(screenClasses)}</>;
};

export default ResponsiveWrapper; 