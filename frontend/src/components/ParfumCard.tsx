import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ParfumCard.module.css';

export interface ParfumProps {
  id: string;
  numeroParf: string; // Remplacé reference par numeroParf
  inspiration?: string;
  prix: number;
  genre: 'F' | 'H' | 'U';
  image?: {
    url: string;
    alt: string;
  };
  placeholderUrl?: string;
  imagePlaceholder?: 'feminin' | 'masculin' | 'unisexe';
  slug: string;
  nouveaute?: boolean;
  familleOlfactive?: {
    nom: string;
  };
  // Champs pour la compatibilité à court terme
  reference?: string;
  nom?: string;
}

const ParfumCard: React.FC<ParfumProps> = ({
  numeroParf,
  inspiration,
  prix,
  genre,
  image,
  placeholderUrl,
  imagePlaceholder,
  slug,
  nouveaute,
  familleOlfactive,
  // Compatibilité avec l'ancienne structure
  reference,
  nom,
}) => {
  // Utiliser numeroParf si disponible, sinon fallback sur reference
  const parfumNumero = numeroParf || reference || '';
  
  // Détermine l'image par défaut en fonction du genre
  let defaultImage = '/images/olfazetta-homme.png'; // Par défaut Homme pour Unisexe aussi
  if (genre === 'F') {
    defaultImage = '/images/olfazetta-femme.png'; // Image flacon blanc pour femme
  }
  
  // Génère une URL d'image: utilise l'image du parfum si disponible, sinon l'image par défaut selon le genre
  const imageUrl = image?.url || placeholderUrl || defaultImage;
  const imageAlt = image?.alt || `Parfum ${parfumNumero}`;  // Utiliser le numéro au lieu du nom
  
  // Formatte le prix avec 2 décimales et symbole €
  const prixFormatted = `${prix.toFixed(2)} €`;
  
  // Définit le texte du genre (Femme, Homme, ou Unisexe)
  const genreText = {
    'F': 'Femme',
    'H': 'Homme',
    'U': 'Unisexe'
  }[genre] || 'Unisexe';
  
  return (
    <div className={styles.card}>
      {nouveaute && <span className={styles.nouveaute}>Nouveau</span>}
      
      <Link href={`/parfums/ref-${parfumNumero}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          {/* Utilisation d'une div avec background-image comme fallback si next/image échoue */}
          <div 
            className={styles.imageFallback}
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={280}
              height={280}
              className={styles.image}
              onError={(e) => {
                // Si l'image ne se charge pas, on utilise le background-image défini au-dessus
                e.currentTarget.style.opacity = '0';
              }}
            />
          </div>
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>N°{parfumNumero}</h3>
          <p className={styles.reference}>Série Exclusive</p>
          
          <div className={styles.details}>
            <span className={styles.genre}>{genreText}</span>
            {familleOlfactive && (
              <span className={styles.famille}>{familleOlfactive.nom}</span>
            )}
          </div>
          
          <p className={styles.prix}>{prixFormatted}</p>
        </div>
      </Link>
    </div>
  );
};

export default ParfumCard;
