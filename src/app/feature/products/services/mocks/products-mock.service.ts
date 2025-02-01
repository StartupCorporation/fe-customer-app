import { Injectable } from '@angular/core';
import { Product } from '../../models/product-model';
import { filter, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsMockService {
  constructor() {}

  private mockProducts: Product[] = [
    // {
    //   id: '1',
    //   name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.0,
    // },
    // {
    //   id: '2',
    //   name: 'Інвертор Deye SUN-10K-SG03LP1-EU',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.63,
    // },
    // {
    //   id: '3',
    //   name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '4',
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '5',
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '6',
    //   name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '7',
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '8',
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '6',
    //   name: 'Інвертор Deye SUN-6K-SG03LP1-EU',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '7',
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '8',
    //   name: 'Smartwatch',
    //   description: 'Latest technology with cutting-edge features.',
    //   image: '/assets/images/category-1-Photoroom.png',
    //   price: 49051.1,
    // },
    // {
    //   id: '6',
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

  getProducts(categoryId: number): Observable<Product[]> {
    return of(this.mockProducts);
  }
}
