import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { LandingFooterComponent } from "../../../landing/components/landing-footer/landing-footer.component";
import { LandingWelcomeWindowComponent } from "../../../landing/components/landing-welcome-window/landing-welcome-window.component";
import { ImageSliderComponent } from "../../../../shared/components/image-slider/image-slider.component";
import { ProductsDetailDescriptionComponent } from "../../components/products-detail-description/products-detail-description.component";
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product-model';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { MessageService } from 'src/app/core/services/message.service';
import { MessageModel } from 'src/app/shared/models/message-model';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';
import { SafeArrayPipe } from "../../../../shared/pipes/safeArray.pipe";
import { ProductsCharacteristicsTableComponent } from "../../components/products-characteristics-table/products-characteristics-table.component";

@Component({
  selector: 'app-products-page-detail',
  templateUrl: './products-page-detail.component.html',
  styleUrls: ['./products-page-detail.component.scss'],
  imports: [
    LandingFooterComponent,
    LandingWelcomeWindowComponent,
    ImageSliderComponent,
    ProductsDetailDescriptionComponent,
    ProductsCharacteristicsTableComponent,
    ToastComponent,
    NgIf,
    AsyncPipe,
    SafeArrayPipe
  ],
  standalone: true
})
export class ProductsPageDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private productsService = inject(ProductsService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);

  product = new Product();
  messages$: Observable<MessageModel[]>;
  isLoading = false;
  loadError = false;

  constructor() {
    this.messages$ = this.messageService.getMessages();
  }

  ngOnInit() {
    this.loadProductDetails();
  }

  private loadProductDetails() {
    const productId = String(this.activatedRoute.snapshot.params['id']);
    if (!productId) {
      this.handleError('Product ID is missing');
      return;
    }

    this.isLoading = true;
    this.loadError = false;

    this.productsService.getProductById(productId).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (product) => {
        if (!product || !product.id) {
          this.handleError('Product not found');
          return;
        }
        this.product = product;
      },
      error: (error) => {
        this.handleError('Failed to load product details');
        console.error('Error loading product:', error);
      }
    });
  }

  private handleError(message: string) {
    this.loadError = true;
    const errorMessage = new MessageModel(
      404,
      [message],
      MessageTypeEnum.Error
    );
    this.messageService.addMessage(errorMessage);
  }

  addToCart(product: Product): void {
    this.cartService.increment({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images?.[0]?.link || ''
    });
    
    // Add success message
    const message = new MessageModel(
      200,
      [`Товар "${product.name}" додано до кошика`],
      MessageTypeEnum.Success
    );
    
    this.messageService.addMessage(message);
  }

  deleteMessages() {
    this.messageService.deleteAllMessages();
  }

  scrollToCharacteristics(): void {
    const characteristicsElement = document.querySelector('.products-detail__characteristics');
    if (characteristicsElement) {
      characteristicsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
