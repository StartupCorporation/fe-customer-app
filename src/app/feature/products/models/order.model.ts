export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface PersonalInformation {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface OrderRequest {
  products: OrderProduct[];
  personalInformation: PersonalInformation;
  customerComment?: string;
  messageCustomer: boolean;
}

export interface OrderResponse {
  id: string;
  status: string;
  createdAt: string;
  products: OrderProduct[];
  personalInformation: PersonalInformation;
  customerComment?: string;
  messageCustomer: boolean;
} 