import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api/client';

export interface CartItem {
  id: string; // Unique client-side key
  menuItemId: number;
  name: string;
  image: string;
  price: number; // Integer cents/units (e.g., 450)
  quantity: number;
  customization: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  checkout: () => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart state from localStorage on load
  useEffect(() => {
    const savedCart = localStorage.getItem('italia_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('italia_cart');
      }
    }
  }, []);

  // Sync cart to localStorage on changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('italia_cart', JSON.stringify(newCart));
  };

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    // Generate an identity matching key
    const customKey = `${newItem.menuItemId}-${newItem.customization.trim().toLowerCase()}`;
    
    const existingIndex = cart.findIndex((item) => {
      const itemKey = `${item.menuItemId}-${item.customization.trim().toLowerCase()}`;
      return itemKey === customKey;
    });

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += newItem.quantity;
      saveCart(updated);
    } else {
      const itemWithId: CartItem = {
        ...newItem,
        id: `${newItem.menuItemId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        customization: newItem.customization.trim()
      };
      saveCart([...cart, itemWithId]);
    }
  };

  const removeItem = (id: string) => {
    const filtered = cart.filter((item) => item.id !== id);
    saveCart(filtered);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalPrice = cart.reduce((accum, item) => accum + item.price * item.quantity, 0);

  const checkout = async (): Promise<any> => {
    if (cart.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const payload = {
      items: cart.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        customization: item.customization,
      })),
    };

    try {
      const completedOrder = await apiClient('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Erase shopping cart upon order submission success
      clearCart();
      return completedOrder;
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
