import { OrderItem } from './OrderItem';


export interface CarPartOrder {
  id: number;

  // 🔥 flattened field from backend DTO
  userEmail: string;

  whatsapp: string;
  phone: string;
  deliveryAddress: string;

  dateDelivery: string;

  status: 'PENDING' | 'CONFIRMED' | 'DECLINED';

  items: OrderItem[];
}
