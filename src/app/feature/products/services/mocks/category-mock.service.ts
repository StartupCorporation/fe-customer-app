import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryModel } from '../../../products/models/category-model';
import { CategoryRepository } from '../../repositories/category-repository';

@Injectable({
  providedIn: 'root'
})
export class CategoryMockService implements CategoryRepository {
  private mockCategories: CategoryModel[] = [
    {
      id: 1,
      name: 'Інвертори',
      image: '/assets/images/category-1-Photoroom.png',
      description: 'I Love KIRILL'
    } as CategoryModel,
    {
      id: 2,
      name: 'Акумулятори',
      image: '/assets/images/category-2-Photoroom.png',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore vero quisquam magni delectus, voluptatem quia aliquam praesentium accusantium aperiam dicta totam consectetur iusto doloremque laboriosam, nisi, suscipit eaque. Ab, dolores.'
    }as CategoryModel,
    {
      id: 9,
      name: 'Блок управління',
      image: '/assets/images/category-3-Photoroom.png',
      description: 'Description for control units...'
    } as CategoryModel,
  ];

  getCategories(): Observable<CategoryModel[]> {
    return of(this.mockCategories);
  }
}
