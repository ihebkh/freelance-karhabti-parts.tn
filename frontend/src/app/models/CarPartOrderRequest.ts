import { OrderItemRequest } from "./OrderItemRequest";

export interface CarPartOrderRequest {
  whatsapp: string;
  phone: string;
  deliveryAddress: string;
  items: OrderItemRequest[];
}
