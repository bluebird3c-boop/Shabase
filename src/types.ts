export type Tab = 'home' | 'buy' | 'sell' | 'wallet' | 'profile' | 'about';

export interface User {
  id: string;
  name: string;
  phone?: string;
  location?: string;
  walletBalance: number;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: any;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale' | 'refund';
  description: string;
  createdAt: any;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: any;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  sellerId: string;
  category?: string;
  location?: string;
  phone?: string;
  ratingCount?: number;
  averageRating?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
