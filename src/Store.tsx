import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Role, User } from './types';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';

interface StoreContextValue {
  user: User | null;
  logout: () => void;
  role: Role;
  setRole: (r: Role) => void;
  products: Product[];
  addProduct: (p: Omit<Product, 'id' | 'sellerId'>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [role, setRole] = useState<Role>('buyer');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ id: firebaseUser.uid, name: firebaseUser.displayName || firebaseUser.email || 'User' });
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setProducts([]);
      return;
    }

    const q = query(collection(db, 'products'));
    const unsubscribeProducts = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        prods.push({
          id: doc.id,
          title: data.title,
          price: data.price,
          description: data.description,
          imageUrl: data.imageUrl,
          sellerId: data.sellerId,
        });
      });
      setProducts(prods.reverse());
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribeProducts();
  }, [user]);

  const logout = async () => {
    await signOut(auth);
    setCart([]);
  };

  const addProduct = async (p: Omit<Product, 'id' | 'sellerId'>) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'products'), {
        ...p,
        sellerId: user.id,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const removeProduct = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
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
      user, logout,
      role, setRole,
      products, addProduct, removeProduct,
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      isLoading: isLoadingAuth
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
