import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/CartItem';
import { CarPart } from '../models/CarPart';
import { AccPart } from '../models/AccPart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart_items';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  get cart(): CartItem[] {
    return this.cartSubject.value;
  }

  // HELPER: Direct access to the current active price
  getItemPrice(part: CarPart | AccPart): number {
    return part.onSale ? (part.priceAfterSale || part.price) : part.price;
  }

  // HELPER: Line item total
  getItemSubtotal(item: CartItem): number {
    return this.getItemPrice(item.part) * item.quantity;
  }

  // HELPER: Entire cart total
  getTotalPrice(): number {
    return this.cart.reduce((sum, item) => sum + this.getItemSubtotal(item), 0);
  }

  addItem(part: CarPart | AccPart, quantity: number) {
    const cart = [...this.cartSubject.value];
    const existing = cart.find(item => item.part.id === part.id);

    // Convert the incoming quantity to a number to prevent string concatenation
    const numQuantity = Number(quantity);

    if (existing) {
      // This now performs math (e.g., 10 + 10) instead of joining strings
      existing.quantity += numQuantity;
    } else {
      cart.push({ part, quantity: numQuantity });
    }
    this.updateCart(cart);
  }

  removeItem(partId: number) {
    const cart = this.cart.filter(item => item.part.id !== partId);
    this.updateCart(cart);
  }

  clearCart() {
    this.updateCart([]);
  }

  private updateCart(cart: CartItem[]) {
    this.cartSubject.next(cart);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
  }

  private loadCart(): CartItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
