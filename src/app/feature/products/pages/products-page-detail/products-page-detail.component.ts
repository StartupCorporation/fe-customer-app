import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LandingFooterComponent } from "../../../landing/components/landing-footer/landing-footer.component";
import { LandingWelcomeWindowComponent } from "../../../landing/components/landing-welcome-window/landing-welcome-window.component";
import { ImageSliderComponent } from "../../../../shared/components/image-slider/image-slider.component";
import { ProductsDetailDescriptionComponent } from "../../components/products-detail-description/products-detail-description.component";
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product-model';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductsMockService } from '../../services/mocks/products-mock.service';

@Component({
  selector: 'app-products-page-detail',
  templateUrl: './products-page-detail.component.html',
  styleUrls: ['./products-page-detail.component.scss'],
  imports: [LandingFooterComponent, LandingWelcomeWindowComponent, ImageSliderComponent, ProductsDetailDescriptionComponent]
})
export class ProductsPageDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private productsService = inject(ProductsMockService);
  private activatedRoute = inject(ActivatedRoute);

  product = new Product();

  ngOnInit() {
    const productId = String(this.activatedRoute.snapshot.params['id']);

    this.productsService.getProductById(productId).pipe(
      takeUntil(this.destroy$)
    ).subscribe(product => {
      this.product = product;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
