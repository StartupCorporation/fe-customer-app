import { Observable } from 'rxjs';
import { CategoryModel } from '../../models/category-model';
import { InjectionToken } from '@angular/core';

export const CATEGORY_SERVICE_TOKEN = new InjectionToken<ICategoryService>('ICategoryService');

export interface ICategoryService {
  getCategories(): Observable<CategoryModel[]>;
}