'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as api from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    thumbnail_url: string | null;
    weight: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (productId: string, qty?: number) => Promise<void>;
  updateItem: (itemId: string, qty: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  // Local cart for guests
  localItems: LocalCartItem[];
  addLocal: (product: LocalCartItem) => void;
  updateLocal: (productId: string, qty: number) => void;
  removeLocal: (productId: string) => void;
}

interface LocalCartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail_url: string | null;
  weight: string | null;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [localItems, setLocalItems] = useState<LocalCartItem[]>([]);

  const fetchCart = async () => {
    try {
      const cart = await api.getCart();
      setItems(cart.items || []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
      // Load from localStorage
      const saved = localStorage.getItem('makriva_local_cart');
      if (saved) {
        setLocalItems(JSON.parse(saved));
      }
    } else {
      const saved = localStorage.getItem('makriva_local_cart');
      setLocalItems(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  const addItem = async (productId: string, qty = 1) => {
    try {
      const cart = await api.addToCart(productId, qty);
      setItems(cart.items || []);
      toast.success('Added to cart!');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const updateItem = async (itemId: string, qty: number) => {
    try {
      const cart = await api.updateCartItem(itemId, qty);
      setItems(cart.items || []);
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const cart = await api.removeCartItem(itemId);
      setItems(cart.items || []);
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        // For authenticated users, clear server-side cart
        await api.clearCart();
        setItems([]);
      } else {
        // For guests, clear local cart
        setLocalItems([]);
        localStorage.removeItem('makriva_local_cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Still clear client-side state even if server request fails
      if (user) {
        setItems([]);
      } else {
        setLocalItems([]);
        localStorage.removeItem('makriva_local_cart');
      }
    }
  };

  const addLocal = (product: LocalCartItem) => {
    setLocalItems(prev => {
      const existing = prev.find(i => i.product_id === product.product_id);
      const updated = existing
        ? prev.map(i => i.product_id === product.product_id ? { ...i, quantity: i.quantity + product.quantity } : i)
        : [...prev, product];
      localStorage.setItem('makriva_local_cart', JSON.stringify(updated));
      return updated;
    });
    toast.success('Added to cart!');
  };

  const updateLocal = (productId: string, qty: number) => {
    setLocalItems(prev => {
      const updated = qty <= 0
        ? prev.filter(i => i.product_id !== productId)
        : prev.map(i => i.product_id === productId ? { ...i, quantity: qty } : i);
      localStorage.setItem('makriva_local_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeLocal = (productId: string) => {
    setLocalItems(prev => {
      const updated = prev.filter(i => i.product_id !== productId);
      localStorage.setItem('makriva_local_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const itemCount = user
    ? items.reduce((sum, i) => sum + i.quantity, 0)
    : localItems.reduce((sum, i) => sum + i.quantity, 0);

  const total = user
    ? items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    : localItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, total, addItem, updateItem, removeItem, clearCart, localItems, addLocal, updateLocal, removeLocal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
