import { Injectable } from '@angular/core';
import { Product } from '../../models/product-model';
import { filter, map, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from 'src/app/core/services/environment.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsMockService extends ApiService {
  readonly urlPath = 'products' as const;

  constructor(http: HttpClient, envService: EnvironmentService) {
    super(http, envService);
  }
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.0,
    },
    {
      id: '2',
      name: 'Інвертор Deye SUN-10K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.63,
    },
    {
      id: '3',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '4',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '5',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '6',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '7',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '8',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '6',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '7',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '8',
      name: 'Smartwatch',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    {
      id: '6',
      name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
      images: ['/assets/images/category-1-Photoroom.png'],
      price: 49051.1,
    },
    // {
    //   id: 7,
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: 8,
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: 6,
    //   name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: 7,
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: 8,
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
  ];

  getProducts(queryParams?: Record<string, any>): Observable<Product[]> {
    let path: string = this.urlPath; // "products"

    if (queryParams && Object.keys(queryParams).length > 0) {
      const queryString = this.generateQueryParams(queryParams);
      path = `${path}?${queryString}`;
    }

    // Now call the "get" method from ApiService:
    this.get<Product[]>(path).pipe(map((res) => Product.fromArrayJson(res)));
    
    return of(this.mockProducts);
  }
}
