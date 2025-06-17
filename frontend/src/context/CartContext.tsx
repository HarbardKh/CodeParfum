import React, { createContext, useState, useContext } from 'react';

// Type pour un article dans le panier
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  imagePlaceholder?: string;
}

// Type pour le contexte du panier
export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getItemQuantity: (id: string) => number;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

// Création du contexte avec des valeurs par défaut
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  getItemQuantity: () => 0,
  clearCart: () => {},
  itemCount: 0,
  totalPrice: 0,
});

// Hook personnalisé pour utiliser le contexte du panier
export const useCart = () => useContext(CartContext);

// Fournisseur du contexte du panier
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Calculer le nombre total d'articles et le prix total directement
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Ajouter un article au panier
  const addToCart = (item: CartItem) => {
    // Vérifier si l'article existe déjà dans le panier
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Si l'article existe, mettre à jour sa quantité
      updateQuantity(item.id, existingItem.quantity + item.quantity);
    } else {
      // Sinon, ajouter le nouvel article
      setCart([...cart, { ...item, quantity: item.quantity || 1 }]);
    }
  };

  // Supprimer un article du panier
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  // Mettre à jour la quantité d'un article
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // Si la quantité est 0 ou moins, supprimer l'article
      removeFromCart(id);
    } else {
      // Sinon, mettre à jour la quantité
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  // Obtenir la quantité d'un article dans le panier
  const getItemQuantity = (id: string) => {
    const item = cart.find(item => item.id === id);
    return item ? item.quantity : 0;
  };

  // Vider complètement le panier
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getItemQuantity,
      clearCart,
      itemCount,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
