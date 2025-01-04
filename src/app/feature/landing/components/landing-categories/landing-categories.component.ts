import { Component, OnInit, Inject } from '@angular/core';
import { CategoryModel } from '../../../products/models/category-model';
import { NgFor } from '@angular/common';
import { CategoryRepository } from '../../../products/repositories/category-repository';
import { CategoryMockService } from '../../../products/services/mocks/category-mock.service';
import { CategoryService } from '../../../products/services/category.service';

@Component({
  selector: 'app-landing-categories',
  templateUrl: './landing-categories.component.html',
  styleUrls: ['./landing-categories.component.scss'],
  imports: [NgFor],

})
export class LandingCategoriesComponent implements OnInit {
  categories: CategoryModel[] = [];
  flippedCards: { [key: number]: boolean } = {};

  //TODO: use .env variable to use mock/not mock service
  //To use API call instead of mock replace on line 23 CategoryMockService to CategoryService
  constructor(private categoryRepository: CategoryService) {}

  ngOnInit(): void {
    this.categoryRepository.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  toggleCard(categoryId: number): void {
    this.flippedCards[categoryId] = !this.flippedCards[categoryId];
  }

  isFlipped(categoryId: number): boolean {
    return this.flippedCards[categoryId] || false;
  }
}
