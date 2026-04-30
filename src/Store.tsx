import React, { createContext, useContext, useState } from 'react';
import { Product, CartItem, Role } from './types';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Premium Wireless Headphones',
    price: 299.99,
    description: 'Over-ear noise-cancelling headphones with 30-hour battery life. Experience crystal clear sound with minimalist design.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    sellerId: 'vendor_1'
  },
  {
    id: 'p2',
    title: 'Mechanical Keyboard',
    price: 149.50,
    description: 'Tenkeyless layout with tactile switches and RGB backlighting. Perfect for typists and developers.',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
    sellerId: 'vendor_2'
  },
  {
    id: 'p3',
    title: 'Ceramic Coffee Mug',
    price: 24.00,
    description: 'Handcrafted ceramic mug, perfect for your morning brew. Each piece features a unique glaze pattern.',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800',
    sellerId: 'vendor_1'
  },
  {
    id: 'p4',
    title: 'Minimalist Wristwatch',
    price: 199.00,
    description: 'Sleek, modern watch with a genuine leather strap. Water-resistant up to 50 meters.',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800',
    sellerId: 'me' // Pre-populated "my" product
  }
];

interface StoreContextValue {
  role: Role;
  setRole: (r: Role) => void;
  products: Product[];
  addProduct: (p: Omit<Product, 'id' | 'sellerId'>) => void;
  removeProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('buyer');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addProduct = (p: Omit<Product, 'id' | 'sellerId'>) => {
    const newProduct: Product = {
      ...p,
      id: Math.random().toString(36).substring(2, 9),
      sellerId: 'me', // Assuming the current logged-in seller is 'me'
    };
    setProducts([newProduct, ...products]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  return (
    <StoreContext.Provider value={{
      role, setRole,
      products, addProduct, removeProduct,
      cart, addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
