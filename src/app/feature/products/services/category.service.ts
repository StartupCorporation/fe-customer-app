import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { HttpClient } from '@angular/common/http';
import { CategoryModel } from '../models/category-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ApiService{
  readonly urlPath = 'category' as const;

  constructor(http: HttpClient) {
    super(http);
  }

  getCategories(): Observable<CategoryModel[]> {
    const url = `${this.urlPath}`;

    return this.get<CategoryModel[]>(url).pipe(
      map((res) => CategoryModel.fromArrayJson(res))
    );
  }
}
