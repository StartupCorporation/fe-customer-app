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
  readonly urlPath = 'products' as const;

  constructor(http: HttpClient, envService: EnvironmentService) {
    super(http, envService);
  }

  getProducts(queryParams?: Record<string, any>): Observable<Product[]> {
    // Build query string from the provided params
    let path: string = this.urlPath; // "products"

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = this.generateQueryParams(queryParams);
      path = `${path}?${queryString}`;
    }

    // Now call the "get" method from ApiService:
    return this.get<Product[]>(path).pipe(
      map((res: any) => Product.fromArrayJson(res.content))
    );
  }

  getProductById(productId: string): Observable<Product> {
    let path: string = `${this.urlPath}/${productId}`;

    return this.get<Product[]>(path)
      .pipe(
        map((res) => Product.fromJson(res)
        )
      );
  }
}
