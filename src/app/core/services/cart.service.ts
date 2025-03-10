import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './modal/cart.interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  private isCartVisibleSubject = new BehaviorSubject<boolean>(false);
  isCartVisible$ = this.isCartVisibleSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCart();
  }

  showCart(): void {
    this.isCartVisibleSubject.next(true);
  }

  hideCart(): void {
    this.isCartVisibleSubject.next(false);
  }

  private loadCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const items = localStorage.getItem(this.cartKey);
      this.cartItemsSubject.next(items ? JSON.parse(items) : []);
    }
  }

  private saveCart(items: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.cartKey, JSON.stringify(items));
    }
    this.cartItemsSubject.next(items);
  }

  increment(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(ci => ci.id === item.id);
    
    if (existingItem) {
      const items = currentItems.map((ci) =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
      );
      this.saveCart(items);
    } else {
      const newItem = { ...item, quantity: 1 };
      this.saveCart([...currentItems, newItem]);
    }
  }

  updateQuantity(item: CartItem, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    if (quantity <= 0) {
      this.removeItem(item.id);
      return;
    }
    const items = currentItems.map((ci) =>
      ci.id === item.id ? { ...ci, quantity } : ci
    );
    this.saveCart(items);
  }

  decrement(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    if (item.quantity <= 1) {
      return;
    }
    const items = currentItems.map((ci) =>
      ci.id === item.id ? { ...ci, quantity: ci.quantity - 1 } : ci
    );
    this.saveCart(items);
  }

  removeItem(itemId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const items = currentItems.filter(item => item.id !== itemId);
    this.saveCart(items);
  }

  clearCart(): void {
    this.saveCart([]);
  }
}
