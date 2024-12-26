import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category-model';
import { InjectionToken } from '@angular/core';



export interface CategoryRepository {
  getCategories(): Observable<CategoryModel[]>;
}