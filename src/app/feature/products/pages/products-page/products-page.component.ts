import { Component, inject, OnInit } from '@angular/core';
import { LandingFooterComponent } from '../../../landing/components/landing-footer/landing-footer.component';
import { LandingNavbarComponent } from '../../../landing/components/landing-navbar/landing-navbar.component';
import { LandingWelcomeWindowComponent } from '../../../landing/components/landing-welcome-window/landing-welcome-window.component';
import { ProductsListComponent } from '../../components/products-list/products-list.component';
import { Product } from '../../models/product-model';
import { ProductsFilterComponent } from '../../components/products-filter/products-filter.component';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SafeArrayPipe } from '../../../../shared/pipes/safeArray.pipe';
import { ProductsMockService } from '../../services/mocks/products-mock.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  imports: [
    LandingFooterComponent,
    LandingWelcomeWindowComponent,
    ProductsListComponent,
    ProductsFilterComponent,
    AsyncPipe,
    SafeArrayPipe,
  ],
})
export class ProductsPageComponent implements OnInit {
  $products!: Observable<Product[]>;
  categoryId!: number;

  private productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.$products = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        this.categoryId = id ? +id : 0;
        return this.productsService.getProducts(this.categoryId);
      })
    );
  }
}
