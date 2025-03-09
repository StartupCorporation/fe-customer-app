// cart-item.model.ts
export interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  description?: string;
}
