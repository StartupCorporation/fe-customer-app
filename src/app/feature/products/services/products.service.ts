import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from 'src/app/core/services/environment.service';
import { ApiService } from 'src/app/shared/services/api.service';
import { Product } from '../models/product-model';
import { catchError, map, Observable, of, tap } from 'rxjs';

export interface ProductsResponse {
  content: Product[];
  priceRange: { min: number; max: number };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  readonly urlPath = 'products' as const;

  constructor(http: HttpClient, envService: EnvironmentService) {
    super(http, envService);
  }

  getProducts(queryParams?: Record<string, any>): Observable<ProductsResponse> {
    // Build query string from the provided params
    let path: string = this.urlPath; // "products"

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = this.generateQueryParams(queryParams);
      path = `${path}?${queryString}`;
    }

    return this.get<any>(path).pipe(
      map((response: any) => {
        // Ensure content is an array before processing
        const content = Array.isArray(response.content) ? response.content : [];
        
        try {
          const productsResponse: ProductsResponse = {
            content: Product.fromArrayJson(content),
            priceRange: response.priceRange || { min: 0, max: 0 },
            totalPages: response.totalPages || 0,
            totalElements: response.totalElements || 0,
            last: response.last || false,
            size: response.size || 0,
            number: response.number || 0,
            numberOfElements: response.numberOfElements || 0,
            first: response.first || false,
            empty: response.empty || true
          };
          
          return productsResponse;
        } catch (error) {
          throw error;
        }
      }),
      catchError(error => {
        // Return a default empty response instead of throwing
        return of({
          content: [],
          priceRange: { min: 0, max: 0 },
          totalPages: 0,
          totalElements: 0,
          last: true,
          size: 10,
          number: 0,
          numberOfElements: 0,
          first: true,
          empty: true
        });
      })
    );
  }

  getProductById(productId: string): Observable<Product> {
    let path: string = `${this.urlPath}/${productId}`;

    return this.get<any>(path)
      .pipe(
        map((res) => {
          try {
            return Product.fromJson(res);
          } catch (error) {
            throw error;
          }
        }),
        catchError(error => {
          // Return a default empty product instead of throwing
          return of(new Product());
        })
      );
  }
}
