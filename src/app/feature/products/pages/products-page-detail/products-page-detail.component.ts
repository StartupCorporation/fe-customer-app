import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { LandingFooterComponent } from "../../../landing/components/landing-footer/landing-footer.component";
import { LandingWelcomeWindowComponent } from "../../../landing/components/landing-welcome-window/landing-welcome-window.component";
import { ImageSliderComponent } from "../../../../shared/components/image-slider/image-slider.component";
import { ProductsDetailDescriptionComponent } from "../../components/products-detail-description/products-detail-description.component";
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product-model';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProductsMockService } from '../../services/mocks/products-mock.service';
import { CartService } from 'src/app/core/services/cart.service';
import { MessageService } from 'src/app/core/services/message.service';
import { MessageModel } from 'src/app/shared/models/message-model';
import { MessageTypeEnum } from 'src/app/shared/enums/message-type-enum';
import { ToastComponent } from 'src/app/shared/components/toast/toast.component';
import { SafeArrayPipe } from "../../../../shared/pipes/safeArray.pipe";

@Component({
  selector: 'app-products-page-detail',
  templateUrl: './products-page-detail.component.html',
  styleUrls: ['./products-page-detail.component.scss'],
  imports: [
    LandingFooterComponent,
    LandingWelcomeWindowComponent,
    ImageSliderComponent,
    ProductsDetailDescriptionComponent,
    ToastComponent,
    NgIf,
    AsyncPipe,
    SafeArrayPipe
]
})
export class ProductsPageDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private productsService = inject(ProductsMockService);
  private activatedRoute = inject(ActivatedRoute);
  private cartService = inject(CartService);
  private messageService = inject(MessageService);

  product = new Product();
  messages$: Observable<MessageModel[]>;

  constructor() {
    this.messages$ = this.messageService.getMessages();
  }

  ngOnInit() {
    const productId = String(this.activatedRoute.snapshot.params['id']);

    this.productsService.getProductById(productId).pipe(
      takeUntil(this.destroy$)
    ).subscribe(product => {
      this.product = product;
    });
  }

  addToCart(product: Product): void {
    this.cartService.increment({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0]
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
