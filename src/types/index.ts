export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  vehicle?: string;
}

export type OrderStatus =
  | "pending"
  | "order_confirmed"
  | "being_packed"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    shippingAddress: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  items: {
    product: {
      _id: string;
      name: string;
      images: string[];
    };
    quantity: number;
  }[];
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime?: string;
  notes?: string;
  totalAmount: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string,
    vehicle?: string
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
