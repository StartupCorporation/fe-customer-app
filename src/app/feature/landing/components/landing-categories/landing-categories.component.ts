import { Component, OnInit, Inject } from '@angular/core';
import { CategoryModel } from '../../../products/models/category-model';
import { AsyncPipe, NgFor } from '@angular/common';
import { CATEGORY_SERVICE_TOKEN, ICategoryService } from 'src/app/feature/products/services/interfaces/category.service.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landing-categories',
  templateUrl: './landing-categories.component.html',
  styleUrls: ['./landing-categories.component.scss'],
  imports: [NgFor, AsyncPipe]
})
export class LandingCategoriesComponent implements OnInit {
  $categories!: Observable<CategoryModel[]>;
  flippedCards: { [key: number]: boolean } = {};

  constructor(@Inject(CATEGORY_SERVICE_TOKEN) private categoryService: ICategoryService) {}

  ngOnInit(): void {
    this.$categories = this.categoryService.getCategories();
  }

  toggleCard(categoryId: number): void {
    this.flippedCards[categoryId] = !this.flippedCards[categoryId];
  }

  isFlipped(categoryId: number): boolean {
    return this.flippedCards[categoryId] || false;
  }
}
