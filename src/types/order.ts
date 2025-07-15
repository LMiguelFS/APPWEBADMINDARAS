export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  partial_amount: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  amount: string;
  currency: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface PaginatedOrderResponse {
  current_page: number;
  data: Order[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  per_page: number;
  to: number;
  total: number;
}