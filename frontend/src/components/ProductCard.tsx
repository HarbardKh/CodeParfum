import Link from 'next/link';
import { Product } from '@/types/product';
import { useState } from 'react';
import ImageWithFallback from './ui/ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Formater le prix pour l'affichage en euros
  const formattedPrice = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(product.price);

  // Déterminer le genre pour l'image de fallback
  const gender = product.gender === 'F' ? 'F' : 'M';
  
  // Chemin de l'image basé sur la référence du produit
  const imagePath = `/images/products/${product.reference || product.id}.jpg`;
  
  return (
    <Link href={`/produit/${product.reference || product.id}`} className="block group">
      <div className="relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="relative h-60 w-full overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={imagePath}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fallbackGender={gender}
            priority
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.gender === 'H' ? 'Homme' : product.gender === 'F' ? 'Femme' : 'Unisexe'}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">{formattedPrice}</p>
            <p className="text-sm text-gray-600">{product.volume}</p>
          </div>
          {product.famille_olfactive && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Famille:</span> {product.famille_olfactive}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
} 