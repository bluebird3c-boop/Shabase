export type Role = 'buyer' | 'seller';

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
