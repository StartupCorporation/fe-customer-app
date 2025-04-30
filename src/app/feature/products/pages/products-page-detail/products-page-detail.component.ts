import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { LandingFooterComponent } from "../../../landing/components/landing-footer/landing-footer.component";
import { LandingWelcomeWindowComponent } from "../../../landing/components/landing-welcome-window/landing-welcome-window.component";
import { ImageSliderComponent } from "../../../../shared/components/image-slider/image-slider.component";
import { ProductsDetailDescriptionComponent } from "../../components/products-detail-description/products-detail-description.component";
import { ProductsService } from '../../services/products.service';
import { Product, ProductImage } from '../../models/product-model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';
import { CartService } from 'src/app/core/services/cart.service';
import { MessageService } from 'src/app/core/services/message.service';
import { MessageModel } from 'src/app/shared/models/message-model';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';
import { SafeArrayPipe } from "../../../../shared/pipes/safeArray.pipe";
import { ProductsCharacteristicsTableComponent } from "../../components/products-characteristics-table/products-characteristics-table.component";
import { ProductDetailCommentsComponent } from "../../components/product-detail-comments/product-detail-comments.component";
import { IconComponent } from "../../../../shared/components/icon/icon.component";

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
    ProductDetailCommentsComponent,
    ToastComponent,
    NgIf,
    AsyncPipe,
    SafeArrayPipe,
    IconComponent
  ],
  standalone: true
})
export class ProductsPageDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private productsService = inject(ProductsService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  private router = inject(Router);

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

  navigateToProductsList(): void {
    this.router.navigate(['/products']);
  }

  private loadProductDetails() {
    const productId = String(this.activatedRoute.snapshot.params['id']);
    if (!productId) {
      this.handleError('ID товару не знайдено');
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
          this.handleError('Товар не знайдено');
          return;
        }
        this.product = product;
      },
      error: (error) => {
        this.handleError('Помилка при запиті деталей товару');
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

    getImagesByOrder(): ProductImage[] {
      if (!this.product.images || this.product.images.length === 0) {
        return [];
      }
      
      // Sort images by order (if order is defined)
      const sortedImages = [...this.product.images].sort((a, b) => {
        // If order is undefined, treat it as highest order
        const orderA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
        const orderB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;
        
        return orderA - orderB;
      });
      
      return sortedImages;
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
