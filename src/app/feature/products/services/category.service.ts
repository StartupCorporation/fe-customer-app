import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { CategoryModel } from '../models/category-model';

import { EnvironmentService } from 'src/app/core/services/environment.service';
import { ICategoryService } from './interfaces/category.service.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ApiService implements ICategoryService{
  readonly urlPath = 'categories' as const;

  constructor(http: HttpClient, envService: EnvironmentService) {
    super(http,envService);
  }

  getCategories(): Observable<CategoryModel[]> {
    const url = `${this.urlPath}`;

    return this.get<CategoryModel[]>(url).pipe(
      map((res) => CategoryModel.fromArrayJson(res))
    );
  }
}
