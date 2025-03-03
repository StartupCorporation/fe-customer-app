import { Routes } from '@angular/router';
import { LandingPageComponent } from './feature/landing/pages/landing-page/landing-page.component';
import { ProductsPageComponent } from './feature/products/pages/products-page/products-page.component';
import { ProductsPageDetailComponent } from './feature/products/pages/products-page-detail/products-page-detail.component';

export const routes: Routes = [
    {
      path: 'home',
      component: LandingPageComponent,
    },
    {
      path: 'products',
      component: ProductsPageComponent,
    },
    {
      path: 'products/:id',
      component: ProductsPageDetailComponent,
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: LandingPageComponent
    },
  ];
  