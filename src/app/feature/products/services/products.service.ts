import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { Product } from '../models/product-model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  readonly urlPath = 'category' as const;

  constructor(http: HttpClient, envService: EnvironmentService) {
    super(http, envService);
  }

  getProducts(categoryId: string): Observable<Product[]> {
    const url = `${this.urlPath}/${categoryId}/products`;

    return this.get<Product[]>(url).pipe(
      map((res) => Product.fromArrayJson(res))
    );
  }
}
