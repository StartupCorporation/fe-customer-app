import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { slideAnimation } from '../../animations/slide.animation';
import { ProductImage } from 'src/app/feature/products/models/product-model';

interface Slide {
  image: string;
  description: string;
}

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss',
  animations: [slideAnimation]
})
export class ImageSliderComponent implements OnChanges {
  @Input() images: ProductImage[] = [];
  
  currentIndex = 0;
  slides: Slide[] = [];
  private apiUrl = 'http://localhost:9999/images/';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'] && this.images && this.images.length > 0) {
      this.slides = this.images.map((img) => ({
        image: this.getFullImageUrl(img.link),
        description: 'Product Image'
      }));
      this.currentIndex = 0;
      this.preloadImages();
    } else {
      this.slides = [];
    }
  }

  private getFullImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${this.apiUrl}${imagePath}`;
  }

  preloadImages() {
    this.slides.forEach(slide => {
      (new Image()).src = slide.image;
    });
  }

  setCurrentSlideIndex(index: number) {
    this.currentIndex = index;
  }

  isCurrentSlideIndex(index: number): boolean {
    return this.currentIndex === index;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.slides.length - 1;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex < this.slides.length - 1) ? this.currentIndex + 1 : 0;
  }
}
