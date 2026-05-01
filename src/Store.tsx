import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Tab, User, Order, Transaction } from './types';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, getDoc, setDoc, where } from 'firebase/firestore';

interface StoreContextValue {
  user: User | null;
  logout: () => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  products: Product[];
  addProduct: (p: Omit<Product, 'id' | 'sellerId'>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  orders: Order[];
  transactions: Transaction[];
  addMoney: (amount: number) => Promise<void>;
  checkoutCart: () => Promise<boolean>;
  releasePaymentBuyer: (order: Order) => Promise<void>;
  refundOrderSeller: (order: Order) => Promise<void>;
  submitReview: (productId: string, rating: number, comment: string) => Promise<void>;
  updateProfile: (profile: { name: string; phone: string; location: string }) => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: (v: boolean) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tab, setTab] = useState<Tab>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
          await setDoc(userDocRef, { name: firebaseUser.displayName || 'User', walletBalance: 0 });
          setUser({ id: firebaseUser.uid, name: firebaseUser.displayName || 'User', walletBalance: 0 });
        } else {
          setUser({ id: firebaseUser.uid, ...userSnap.data() } as User);
        }
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.id);
    const unsub = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
         setUser(prev => prev ? { ...prev, walletBalance: docSnap.data().walletBalance || 0 } : null);
      }
    });
    return () => unsub();
  }, [user?.id]);

  useEffect(() => {
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
          category: data.category,
          location: data.location,
          phone: data.phone,
          ratingCount: data.ratingCount,
          averageRating: data.averageRating,
        });
      });
      setProducts(prods.reverse());
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    return () => unsubscribeProducts();
  }, []);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setTransactions([]);
      return;
    }

    const oq = query(collection(db, 'orders')); // Client side filter for simplicity
    const unsubscribeOrders = onSnapshot(oq, (snapshot) => {
       const ords: Order[] = [];
       snapshot.forEach(d => {
         const data = d.data();
         if (data.buyerId === user.id || data.sellerId === user.id) {
           ords.push({ id: d.id, ...data } as Order);
         }
       });
       setOrders(ords.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    });

    const tq = query(collection(db, 'transactions'), where('userId', '==', user.id));
    const unsubscribeTx = onSnapshot(tq, (snapshot) => {
       const txs: Transaction[] = [];
       snapshot.forEach(d => txs.push({ id: d.id, ...d.data() } as Transaction));
       setTransactions(txs.sort((a,b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeTx();
    };
  }, [user?.id]);

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

  const addMoney = async (amount: number) => {
    if (!user) return;
    const newBalance = user.walletBalance + amount;
    await updateDoc(doc(db, 'users', user.id), { walletBalance: newBalance });
    await addDoc(collection(db, 'transactions'), {
      userId: user.id,
      amount,
      type: 'deposit',
      description: 'অ্যাড মানি (Deposit)',
      createdAt: serverTimestamp()
    });
  };

  const checkoutCart = async () => {
    if (!user) return false;
    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    if (user.walletBalance < total) {
      alert("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই! দয়া করে রিচার্জ করুন। (Insufficient balance)");
      return false;
    }
    
    // Deduct
    await updateDoc(doc(db, 'users', user.id), { walletBalance: user.walletBalance - total });
    
    // Create orders
    for (const item of cart) {
      const orderAmount = item.product.price * item.quantity;
      await addDoc(collection(db, 'orders'), {
        productId: item.product.id,
        productTitle: item.product.title,
        buyerId: user.id,
        sellerId: item.product.sellerId,
        amount: orderAmount,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      await addDoc(collection(db, 'transactions'), {
        userId: user.id,
        amount: -orderAmount,
        type: 'purchase',
        description: `কেনাকাটা: ${item.product.title}`,
        createdAt: serverTimestamp()
      });
    }
    
    setCart([]);
    return true;
  };

  const releasePaymentBuyer = async (order: Order) => {
    if (!user) return;
    await updateDoc(doc(db, 'orders', order.id), { status: 'completed' });
    
    const sellerSnap = await getDoc(doc(db, 'users', order.sellerId));
    if (sellerSnap.exists()) {
      const fee = order.amount * 0.02; // 2% platform fee
      const sellerGets = order.amount - fee;
      await updateDoc(doc(db, 'users', order.sellerId), { walletBalance: (sellerSnap.data().walletBalance || 0) + sellerGets });
      await addDoc(collection(db, 'transactions'), {
        userId: order.sellerId,
        amount: sellerGets,
        type: 'sale',
        description: `পণ্য বিক্রয় (Platform fee deducted: ৳${fee.toFixed(2)}): ${order.productTitle}`,
        createdAt: serverTimestamp()
      });
    }
  };

  const refundOrderSeller = async (order: Order) => {
    if (!user) return;
    await updateDoc(doc(db, 'orders', order.id), { status: 'cancelled' });
    
    const buyerSnap = await getDoc(doc(db, 'users', order.buyerId));
    if (buyerSnap.exists()) {
      await updateDoc(doc(db, 'users', order.buyerId), { walletBalance: (buyerSnap.data().walletBalance || 0) + order.amount });
      await addDoc(collection(db, 'transactions'), {
        userId: order.buyerId,
        amount: order.amount,
        type: 'refund',
        description: `রিফান্ড (অর্ডার বাতিল): ${order.productTitle}`,
        createdAt: serverTimestamp()
      });
    }
  };

  const submitReview = async (productId: string, rating: number, comment: string) => {
    if (!user) return;
    
    // Add review
    await addDoc(collection(db, 'reviews'), {
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      createdAt: serverTimestamp()
    });

    // Update product stats
    const productRef = doc(db, 'products', productId);
    const prodSnap = await getDoc(productRef);
    if (prodSnap.exists()) {
      const pData = prodSnap.data();
      const currentCount = pData.ratingCount || 0;
      const currentAvg = pData.averageRating || 0;
      
      const newCount = currentCount + 1;
      const newAvg = ((currentAvg * currentCount) + rating) / newCount;
      
      await updateDoc(productRef, {
        ratingCount: newCount,
        averageRating: newAvg
      });
    }
  };

  const updateProfile = async (profile: { name: string; phone: string; location: string }) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.id), {
      name: profile.name,
      phone: profile.phone,
      location: profile.location
    });
    setUser(prev => prev ? { ...prev, ...profile } : null);
  };

  return (
    <StoreContext.Provider value={{
      user, logout,
      showLoginModal, setShowLoginModal,
      tab, setTab,
      orders, transactions, addMoney, checkoutCart, releasePaymentBuyer, refundOrderSeller, submitReview, updateProfile,
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
