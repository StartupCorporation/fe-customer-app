import { ScrollService } from 'src/app/shared/services/scroll.service';
import { Component, OnInit, Inject, inject } from '@angular/core';
import { CategoryModel } from '../../../products/models/category-model';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  CATEGORY_SERVICE_TOKEN,
  ICategoryService,
} from 'src/app/feature/products/services/interfaces/category.service.interface';
import { Observable } from 'rxjs';
import { SvgIconComponent } from 'src/app/shared/components/svg-icon/svg-icon.component';
import { CarouselComponent } from "../../../../shared/components/carousel/carousel.component";
import { SafeArrayPipe } from 'src/app/shared/pipes/safeArray.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-categories',
  templateUrl: './landing-categories.component.html',
  styleUrls: ['./landing-categories.component.scss'],
  imports: [NgFor, AsyncPipe, CarouselComponent, SafeArrayPipe],
})
export class LandingCategoriesComponent implements OnInit {
  $categories!: Observable<CategoryModel[]>;
  flippedCards: { [key: number]: boolean } = {};
  consultingId = 'consulting';
  private router = inject(Router);
  constructor(
    @Inject(CATEGORY_SERVICE_TOKEN) private categoryService: ICategoryService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.$categories = this.categoryService.getCategories();
  }

  toggleCard(categoryId: number): void {
    this.flippedCards[categoryId] = !this.flippedCards[categoryId];
  }

  isFlipped(categoryId: number): boolean {
    return this.flippedCards[categoryId] || false;
  }

  scrollToConsulting(categoryId: number) {
    this.scrollService.scrollToTarget(this.consultingId);
    this.toggleCard(categoryId);
  }

  getImageName(name: string) {
    return `http://localhost:9999/images/deye-admin-files/${name}`;
  }

  navigateToCategory(categoryId: number) {
    this.router.navigate(['/category', categoryId, 'products']);
  }
}
