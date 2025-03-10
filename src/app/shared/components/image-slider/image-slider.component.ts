import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { slideAnimation } from '../../animations/slide.animation';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss',
  animations: [slideAnimation]
})
export class ImageSliderComponent {
  currentIndex = 0;
  slides = [
    {image: '/assets/images/category-1-Photoroom.png', description: 'Image 00'},
    {image: '/assets/images/invertor-1.png', description: 'Image 01'},
    {image: '/assets/images/invertor-1.png', description: 'Image 02'},
    {image: '/assets/images/category-1-Photoroom.png', description: 'Image 03'},
  ];

  constructor() {
    this.preloadImages();
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
