import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { MessageService } from 'src/app/core/services/message.service';
import { CartService } from 'src/app/core/services/cart.service';
import { CartItem } from 'src/app/core/services/modal/cart.interface';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';
import { OrderService } from '../../services/order.service';
import { OrderProduct, OrderRequest } from '../../models/order.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-products-order-popup',
  templateUrl: './products-order-popup.component.html',
  styleUrls: ['./products-order-popup.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
})
export class ProductsOrderPopupComponent implements OnInit {
  @Output() closePopup = new EventEmitter<void>();

  orderForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  get nameControl(): FormControl {
    return this.orderForm.get('name') as FormControl;
  }

  get phoneControl(): FormControl {
    return this.orderForm.get('phone') as FormControl;
  }

  get emailControl(): FormControl {
    return this.orderForm.get('email') as FormControl;
  }

  get commentControl(): FormControl {
    return this.orderForm.get('comment') as FormControl;
  }

  get contactInMessengerControl(): FormControl {
    return this.orderForm.get('contactInMessenger') as FormControl;
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[- +()0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      comment: [''],
      contactInMessenger: [false],
    });
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    this.phoneControl.setValue(value);
  }

  onBackgroundClick(event: MouseEvent): void {
    if (
      (event.target as HTMLElement).classList.contains('order-popup-container')
    ) {
      this.cancel();
    }
  }

  cancel(): void {
    this.closePopup.emit();
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    // Get cart items
    let cartItems: CartItem[] = [];
    this.cartService.cartItems$
      .subscribe((items) => {
        cartItems = items;
      })
      .unsubscribe();

    // Map cart items to order products
    const orderProducts: OrderProduct[] = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    // Create order request
    const orderRequest: OrderRequest = {
      products: orderProducts,
      personalInformation: {
        name: this.nameControl.value,
        email: this.emailControl.value,
        phoneNumber: '+' +this.phoneControl.value,
      },
      customerComment: this.commentControl.value,
      messageCustomer: this.contactInMessengerControl.value,
    };

    // Submit order
    this.orderService
      .submitOrder(orderRequest)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {

          // Show success message
          this.messageService.addMessage({
            status: 200,
            message: [
              "Ваше замовлення успішно відправлено! Ми зв'яжемося з вами найближчим часом.",
            ],
            type: MessageTypeEnum.Success,
          });

          // Clear cart
          this.cartService.clearCart();

          // Close popup
          this.closePopup.emit();
        },
        error: (error) => {
          console.error('Error submitting order:', error);

          // Show error message
          this.messageService.addMessage({
            status: 500,
            message: [
              'Виникла помилка при оформленні замовлення. Будь ласка, спробуйте ще раз.',
            ],
            type: MessageTypeEnum.Error,
          });
        },
      });
  }
}
