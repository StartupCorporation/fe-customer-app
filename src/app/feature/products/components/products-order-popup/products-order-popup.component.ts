import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MessageService } from 'src/app/core/services/message.service';
import { CartService } from 'src/app/core/services/cart.service';
import { CartItem } from 'src/app/core/services/modal/cart.interface';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';

@Component({
  selector: 'app-products-order-popup',
  templateUrl: './products-order-popup.component.html',
  styleUrls: ['./products-order-popup.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf]
})
export class ProductsOrderPopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();
  
  orderForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+380\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/)]],
      email: ['', [Validators.required, Validators.email]],
      comment: [''],
      contactInMessenger: [false]
    });
  }

  get nameControl(): FormControl {
    return this.getControl('name');
  }

  get phoneControl(): FormControl {
    return this.getControl('phone');
  }

  get emailControl(): FormControl {
    return this.getControl('email');
  }

  get commentControl(): FormControl {
    return this.getControl('comment');
  }

  get contactInMessengerControl(): FormControl {
    return this.getControl('contactInMessenger');
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.startsWith('380')) {
      value = '+' + value;
    } else if (value.startsWith('0')) {
      value = '+38' + value;
    } else if (!value.startsWith('+')) {
      value = '+380' + value;
    }
    
    // Format: +380 XX XXX XX XX
    if (value.length > 4) {
      value = value.substring(0, 4) + ' ' + value.substring(4);
    }
    if (value.length > 7) {
      value = value.substring(0, 7) + ' ' + value.substring(7);
    }
    if (value.length > 11) {
      value = value.substring(0, 11) + ' ' + value.substring(11);
    }
    if (value.length > 14) {
      value = value.substring(0, 14) + ' ' + value.substring(14);
    }
    
    this.phoneControl.setValue(value);
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Get cart items
    let cartItems: CartItem[] = [];
    this.cartService.cartItems$.subscribe(items => {
      cartItems = items;
    }).unsubscribe();
    
    // Create order object
    const order = {
      customerName: this.nameControl.value,
      customerPhone: this.phoneControl.value,
      customerEmail: this.emailControl.value,
      customerComment: this.commentControl.value,
      contactInMessenger: this.contactInMessengerControl.value,
      items: cartItems,
      totalPrice: cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
    };

    // In a real app, you would send this to a service
    console.log('Order submitted:', order);
    
    // Show success message
    this.messageService.addMessage({
      status: 200,
      message: ['Ваше замовлення успішно відправлено! Ми зв\'яжемося з вами найближчим часом.'],
      type: MessageTypeEnum.Success
    });

    // Clear cart
    this.cartService.clearCart();
    
    // Close popup
    this.closePopup.emit();
    
    this.isSubmitting = false;
  }

  cancel(): void {
    this.closePopup.emit();
  }

  private getControl(path: string): FormControl {
    return this.orderForm.get(path) as FormControl;
  }

  onBackgroundClick(event: MouseEvent): void {
    // Only close if clicking directly on the background, not on the form
    if (event.target === event.currentTarget) {
      event.stopPropagation(); // Prevent the event from reaching the cart popup
      this.closePopup.emit();
    }
  }
}
