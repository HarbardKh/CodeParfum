# Système de gestion sécurisée des images

Ce document explique le nouveau système de gestion sécurisée des images mis en place dans le projet Chogan MVP.

## Problèmes résolus

1. **Erreurs 404 dans la console**: Les images manquantes ou cassées généraient des erreurs qui affectaient les performances.
2. **Images statiques mal gérées**: Le chemin vers les images statiques n'était pas correctement configuré.
3. **URLs d'images inconsistantes**: Les URLs des images variaient entre les environnements de développement et production.
4. **Absence de fallbacks**: Les images manquantes affichaient des cases vides au lieu d'images de substitution.
5. **Optimisation des images désactivée**: Les images n'étaient pas optimisées pour les performances.

## Composants et outils créés

### 1. Composant SafeImage

`SafeImage.tsx` est un wrapper autour de `next/image` qui gère:
- La détection des erreurs de chargement
- L'utilisation automatique d'images de substitution (fallback)
- La transformation des URLs pour qu'elles pointent vers le bon serveur
- Une optimisation adaptée aux différents types d'affichage

### 2. Librairie d'utilitaires d'image

`imageUtils.ts` fournit:
- `transformImageUrl()`: Transforme les URLs pour qu'elles pointent vers le bon serveur
- `isValidImageUrl()`: Vérifie si une URL d'image est valide
- `getFallbackImage()`: Retourne une image de substitution selon le type
- `prepareImageUrl()`: Prépare une URL d'image pour l'affichage
- `getImageDimensions()`: Récupère les dimensions optimales selon le type d'image

### 3. Hook personnalisé useSafeImage

`useSafeImage.ts` est un hook React qui:
- Valide et transforme les URLs d'images
- Gère le chargement et les erreurs
- Fournit les propriétés prêtes à l'emploi pour `next/image`
- Attribue automatiquement les bonnes dimensions selon le type

## Comment utiliser le système

### Approche 1: Composant SafeImage (recommandé)

```tsx
import { SafeImage } from '../components/secure';

// Dans votre JSX
<SafeImage
  src={parfum.image?.url}
  alt={parfum.inspiration}
  width={300}
  height={300}
  className="rounded-lg"
  // Optionnel - utilise un fallback par défaut si non spécifié
  fallbackSrc="/images/fallback/parfum-placeholder.jpg"
/>
```

### Approche 2: Hook useSafeImage

```tsx
import { useSafeImage } from '../hooks/useSafeImage';
import { ImageType } from '../lib/imageUtils';
import Image from 'next/image';

// Dans votre composant
const { imgProps } = useSafeImage(parfum.image?.url, parfum.inspiration, {
  type: ImageType.PARFUM
});

// Puis utiliser les props avec Next/Image
<Image {...imgProps} className="rounded-lg" />
```

### Approche 3: Utilitaires directs

```tsx
import { prepareImageUrl, ImageType } from '../lib/imageUtils';
import Image from 'next/image';

// Préparer l'URL
const imageUrl = prepareImageUrl(parfum.image?.url, ImageType.PARFUM);

// Utiliser avec Next/Image
<Image 
  src={imageUrl}
  alt={parfum.inspiration}
  width={300}
  height={300}
  className="rounded-lg"
/>
```

## Types d'images disponibles

- `ImageType.PARFUM`: Images de parfums (300×300px)
- `ImageType.HERO`: Images de bannières héros (1920×600px)
- `ImageType.PROFILE`: Photos de profil (150×150px)
- `ImageType.LOGO`: Logos (200×80px)
- `ImageType.BANNER`: Bannières (1200×400px)
- `ImageType.GENERIC`: Autres images (400×300px)

## Images de substitution (fallbacks)

Des images de substitution sont disponibles pour chaque type d'image dans `/public/images/fallback/`:
- `/images/fallback/parfum-placeholder.jpg`
- `/images/fallback/hero-placeholder.jpg`
- `/images/fallback/profile-placeholder.jpg`
- `/images/fallback/logo-placeholder.jpg`
- `/images/fallback/banner-placeholder.jpg`
- `/images/fallback/placeholder.jpg` (générique)

## Exemple complet

Une page d'exemple est disponible à `/image-test` pour voir toutes les approches en action.

## Variables d'environnement

Les variables suivantes sont configurées:

```
# Configuration des images
NEXT_PUBLIC_IMAGE_DOMAINS=projet-chogan-mvp.onrender.com,cdn.chogan.fr
NEXT_PUBLIC_STATIC_IMAGES_PATH=/images
NEXT_PUBLIC_DEFAULT_FALLBACK_IMAGE=/images/fallback/placeholder.jpg

# Optimisation d'image Next.js
NEXT_IMAGE_OPTIMIZE=true
IMAGE_DOMAINS=projet-chogan-mvp.onrender.com,cdn.chogan.fr
IMAGES_REMOTE_PATTERNS=projet-chogan-mvp.onrender.com/uploads/**,cdn.chogan.fr/**
```

## Recommandations pour la migration

1. Pour les composants critiques, migrez vers `SafeImage` ou `useSafeImage`.
2. Pour les composants moins importants, utilisez au minimum `prepareImageUrl()`.
3. Testez chaque composant après migration pour vérifier que les images s'affichent correctement.
4. Utilisez le type d'image approprié pour chaque cas d'usage.
5. Assurez-vous que des fallbacks pertinents sont disponibles dans `/public/images/fallback/`.

## Tests

Un script de test est disponible pour valider la configuration:

```bash
node src/scripts/test-images.js
```
