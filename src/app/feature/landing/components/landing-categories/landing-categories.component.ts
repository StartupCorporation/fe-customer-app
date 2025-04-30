import { ScrollService } from 'src/app/shared/services/scroll.service';
import { Component, OnInit, Inject, inject } from '@angular/core';
import { CategoryModel } from '../../../products/models/category-model';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  CATEGORY_SERVICE_TOKEN,
  ICategoryService,
} from 'src/app/feature/products/services/interfaces/category.service.interface';
import { Observable, map } from 'rxjs';
import { SvgIconComponent } from 'src/app/shared/components/svg-icon/svg-icon.component';
import { CarouselComponent } from '../../../../shared/components/carousel/carousel.component';
import { SafeArrayPipe } from 'src/app/shared/pipes/safeArray.pipe';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-landing-categories',
  templateUrl: './landing-categories.component.html',
  styleUrls: ['./landing-categories.component.scss'],
  imports: [NgFor, AsyncPipe, CarouselComponent, SafeArrayPipe],
})
export class LandingCategoriesComponent implements OnInit {
  private router = inject(Router);
  private imageService = inject(ImageService);

  $categories!: Observable<CategoryModel[]>;
  flippedCards: { [key: string]: boolean } = {};
  consultingId = 'consulting';

  constructor(
    @Inject(CATEGORY_SERVICE_TOKEN) private categoryService: ICategoryService,
    private scrollService: ScrollService
  ) {}

  ngOnInit(): void {
    this.$categories = this.categoryService.getCategories().pipe(
      map(categories => 
        [...categories].sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  }

  toggleCard(categoryId: string): void {
    this.flippedCards[categoryId] = !this.flippedCards[categoryId];
  }

  isFlipped(categoryId: string): boolean {
    return this.flippedCards[categoryId] || false;
  }

  scrollToConsulting(categoryId: string) {
    this.scrollService.scrollToTarget(this.consultingId);
    this.toggleCard(categoryId);
  }

  getImageName(name: string) {
    const imageContainerLinkUrl = `${this.imageService.getImageContainerUrl()}/${name}`
    return imageContainerLinkUrl;
  }

  navigateToCategory(categoryIds: string) {
    this.router.navigate(['/products'], {
      queryParams: {
        categoriesIds: categoryIds,
        page: 0,
        size: 10
      },
    });
  }
}
