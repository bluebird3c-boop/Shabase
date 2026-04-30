export type Tab = 'home' | 'buy' | 'sell' | 'wallet' | 'profile' | 'about';

export interface User {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  sellerId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
