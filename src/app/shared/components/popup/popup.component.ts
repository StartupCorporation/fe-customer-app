import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, OnDestroy, Output, HostListener, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { CartItem } from 'src/app/core/services/modal/cart.interface';
import { TruncateNumberPipe } from '../../pipes/truncate-number.pipe';
import { ProductsOrderPopupComponent } from 'src/app/feature/products/components/products-order-popup/products-order-popup.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  imports: [NgFor, NgIf, AsyncPipe, TruncateNumberPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private viewContainerRef = inject(ViewContainerRef);
  @Input() popupTitle = 'Корзина';
  @Output() popupCloseEvent = new EventEmitter();
  
  cartItems$: Observable<CartItem[]> = this.cartService.cartItems$;

  trackByFn(index: number, item: CartItem): string {
    return item.id;
  }

  removeFromCart(itemId: string): void {
    this.cartService.removeItem(itemId);
  }

  updateQuantity(item: CartItem, event: Event): void {
    const input = event.target as HTMLInputElement;
    const newQuantity = parseInt(input.value);
    
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item, newQuantity);
    } else {
      // Reset to 1 if invalid value
      input.value = '1';
      this.cartService.updateQuantity(item, 1);
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (event.target instanceof Element && event.target.closest('.modal-overlay')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (event.target instanceof Element && event.target.closest('.modal-overlay')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  ngOnInit(): void {
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  }

  ngOnDestroy(): void {
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
    document.body.style.width = 'auto';
  }

  increment(item: CartItem): void {
    this.cartService.increment(item);
  }

  decrement(item: CartItem): void {
    this.cartService.decrement(item);
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  // Example nav handlers -- you'd wire them up to your router or logic:
  continueShopping(): void {
    // e.g. navigate to product listing: this.router.navigate(['/products']);
    console.log('Continue shopping clicked.');
  }

  checkout(): void {
    // Show the order form popup
    const orderPopup = document.createElement('div');
    orderPopup.id = 'order-popup-container';
    document.body.appendChild(orderPopup);
    
    const orderPopupComponentRef = this.viewContainerRef.createComponent(ProductsOrderPopupComponent);
    orderPopupComponentRef.instance.closePopup.subscribe(() => {
      // Remove the component when closed
      orderPopupComponentRef.destroy();
      document.body.removeChild(orderPopup);
      this.closeModal(); // Close the cart modal too
    });
    
    // Append the component's element to our container
    orderPopup.appendChild(orderPopupComponentRef.location.nativeElement);
  }

  closeModal() {
    this.popupCloseEvent.emit();
  }
}
