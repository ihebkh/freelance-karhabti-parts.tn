export interface OrderItem {
  partId: number;
  partName: string;
  partPrice: number;
  costPrice: number;  // Prix d'achat unitaire au moment de la commande
  quantity: number;
}
