import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, CartItem } from '@/context/CartContext';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [shipping, setShipping] = useState(4.99);
  const [total, setTotal] = useState(0);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  
  // Calculer les totaux lorsque le panier change
  useEffect(() => {
    // Frais de livraison gratuits au-dessus de 50€
    const newShipping = totalPrice > 50 ? 0 : 4.99;
    setShipping(newShipping);
    
    setTotal(totalPrice + newShipping);
  }, [cart, totalPrice]);

  // Formatter les prix en euros
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace('.', ',') + ' €';
  };

  // Animation pour supprimer un élément du panier
  const handleRemoveItem = (id: string) => {
    setRemovingItem(id);
    
    // Attendre que l'animation se termine avant de supprimer l'élément
    setTimeout(() => {
      removeFromCart(id);
      setRemovingItem(null);
    }, 300);
  };

  // Si le panier est vide
  if (cart.length === 0) {
    return (
      <Layout title="Panier - CodeParfum.fr">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8"
        >
          <div className="text-center">
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-serif font-bold text-primary-900 mb-6"
            >
              Votre panier
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-primary-600 mb-8"
            >
              Votre panier est actuellement vide.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/parfums">
                <button
                  className="inline-flex items-center px-8 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-300"
                >
                  Découvrir nos parfums
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout title="Panier - CodeParfum.fr">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-serif font-bold text-primary-900 mb-8"
        >
          Votre panier
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <AnimatePresence>
                {cart.map((item: CartItem) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: removingItem === item.id ? 0 : 1,
                      y: 0,
                      height: removingItem === item.id ? 0 : 'auto',
                      marginTop: removingItem === item.id ? 0 : undefined,
                      marginBottom: removingItem === item.id ? 0 : undefined
                    }}
                    exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 sm:p-6 list-none border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex flex-col sm:flex-row items-center">
                      {/* Image du produit */}
                      <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 mb-4 sm:mb-0">
                        <ImageWithFallback 
                          src={`/images/products/${item.id}.jpg`}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="object-cover object-center w-full h-full"
                          fallbackSrc="/images/placeholder.jpg"
                        />
                      </div>
                      
                      {/* Informations produit */}
                      <div className="flex-1 sm:ml-6 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link href={`/parfums/ref-${item.id}`} className="hover:text-primary-600 transition-colors duration-200">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="mt-1 sm:mt-0 font-medium text-primary-600">{formatPrice(item.price)}</p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-2">Parfum</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="flex items-center mt-2 sm:mt-0">
                            <label htmlFor={`quantity-${item.id}`} className="mr-2 text-sm text-gray-600">
                              Quantité:
                            </label>
                            <select
                              id={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                              className="py-1 px-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-3 sm:mt-0 text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            Supprimer
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
              
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={() => clearCart()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Vider le panier
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          {/* Résumé de la commande */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Résumé de la commande</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Sous-total</p>
                  <p className="font-medium text-gray-900">{formatPrice(totalPrice)}</p>
                </div>
                
                <motion.div 
                  className="flex justify-between"
                  animate={{ 
                    opacity: [1, 0.8, 1],
                    transition: { duration: 0.3 }
                  }}
                  key={shipping}
                >
                  <p className="text-gray-600">Livraison</p>
                  <p className="font-medium text-gray-900">
                    {shipping === 0 ? "Gratuite" : formatPrice(shipping)}
                  </p>
                </motion.div>
                
                {shipping > 0 && (
                  <div className="text-sm text-gray-500 pt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(totalPrice / 50) * 100}%` }}
                      className="h-2 bg-gradient-to-r from-primary-200 to-primary-500 rounded-full mt-1 mb-2"
                    />
                    <p>Plus que {formatPrice(50 - totalPrice)} pour la livraison gratuite</p>
                  </div>
                )}
                
                <motion.div 
                  className="border-t border-gray-200 pt-4 flex justify-between"
                  animate={{ 
                    opacity: [1, 0.8, 1],
                    transition: { duration: 0.3 }
                  }}
                  key={total}
                >
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-lg font-medium text-primary-600">{formatPrice(total)}</p>
                </motion.div>
              </div>
              
              <div className="mt-6">
                <Link href="/commande">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white border-2 border-black rounded-md shadow-sm py-4 px-6 text-lg font-bold text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  >
                    PAYER
                  </motion.button>
                </Link>
              </div>
            </div>
            
            {/* Informations supplémentaires */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Moyens de paiement acceptés</h3>
              <div className="flex space-x-2 items-center">
                <span className="sr-only">Visa</span>
                <svg className="h-8 w-auto" viewBox="0 0 36 24" aria-hidden="true">
                  <rect width="36" height="24" rx="4" fill="#fff" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.5 16.5h-4v-9h4v9z" fill="#1434CB" />
                  <path d="M18.5 7.5h-3l-3 9h3l3-9z" fill="#1434CB" />
                  <path d="M24.5 16.5h3l3-9h-3l-3 9z" fill="#1434CB" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.5 7.5h-2l-3 9h3l2-9zM27.5 7.5h-2l-3 9h3l2-9z" fill="#1434CB" />
                </svg>

                <span className="sr-only">Mastercard</span>
                <svg className="h-8 w-auto" viewBox="0 0 36 24" aria-hidden="true">
                  <rect width="36" height="24" rx="4" fill="#fff" />
                  <circle cx="15" cy="12" r="7" fill="#EB001B" />
                  <circle cx="21" cy="12" r="7" fill="#F79E1B" />
                  <path d="M18 16a7 7 0 010-8z" fill="#FF5F00" />
                </svg>

                <span className="sr-only">PayPal</span>
                <svg className="h-8 w-auto" viewBox="0 0 36 24" aria-hidden="true">
                  <rect width="36" height="24" rx="4" fill="#fff" />
                  <path d="M28.4 10.4h-2l-1.1 7h2l1.1-7z" fill="#139AD6" />
                  <path d="M24.5 10.4h-2l-1.1 7h2l1.1-7z" fill="#263B80" />
                  <path d="M20.6 10.4h-2l-1.1 7h2l1.1-7z" fill="#139AD6" />
                  <path d="M15.8 13.4c-.1-.6.3-1 1.1-1h2.1c.2 0 .4 0 .5.1l.3-2h-3c-1.5 0-2.8 1-3 2.5l-1 6.5h2l.6-4" fill="#232C65" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
} 