import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type CookieConsentProps = {
  privacyPolicyUrl?: string;
};

const CookieConsent: React.FC<CookieConsentProps> = ({ 
  privacyPolicyUrl = '/infos-conditions#confidentialite' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les cookies
    const consentStatus = localStorage.getItem('cookieConsent');
    if (!consentStatus) {
      // Afficher la bannière après un court délai pour une meilleure UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  const customizeCookies = () => {
    // Fonctionnalité future: ouvrir un modal pour paramétrer les cookies
    // Pour l'instant, rediriger vers la politique de confidentialité
    localStorage.setItem('cookieConsent', 'customized');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 py-5 px-4 bg-[#f8f3f5] border-t-4 border-[#8A1538] shadow-xl transform ${hasAnimated ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-500 ease-in-out`}>
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:flex-1 pr-4">
            <h3 className="text-xl font-medium text-[#8A1538] mb-3">Politique de Cookies</h3>
            <p className="text-base text-gray-700 mb-5 md:mb-0 leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. Ces fichiers stockés sur votre appareil nous aident à personnaliser le contenu, proposer des fonctionnalités de médias sociaux et analyser notre trafic.
              <Link href={privacyPolicyUrl} className="text-[#8A1538] font-medium hover:underline ml-1">
                En savoir plus
              </Link>
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <button 
              onClick={customizeCookies}
              className="px-5 py-3 text-sm font-medium text-gray-700 border-2 border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Personnaliser
            </button>
            <button 
              onClick={declineCookies}
              className="px-5 py-3 text-sm font-medium text-gray-700 border-2 border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Refuser
            </button>
            <button 
              onClick={acceptCookies}
              className="px-6 py-3 text-sm font-medium text-white bg-[#8A1538] rounded-md hover:bg-[#731230] transition-colors shadow-md"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 