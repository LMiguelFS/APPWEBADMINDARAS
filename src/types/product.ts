export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sku: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}