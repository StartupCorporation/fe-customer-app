import { NgIf } from '@angular/common';
import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @ViewChild('carousel') carousel!: ElementRef;

  @Input() elementsQty = 0;
  @Input() itemsToScroll = 3;
  @Input() itemWidth = 366;
  @Input() gap = 54;

  get showScrollArrows() {
    return this.elementsQty > 3;
  }

  scrollLeft(): void {
    const container = this.carousel.nativeElement;
    const scrollAmount = (this.itemWidth + this.gap) * this.itemsToScroll;
    container.scrollLeft -= scrollAmount;
  }

  scrollRight(): void {
    const container = this.carousel.nativeElement;
    const scrollAmount = (this.itemWidth + this.gap) * this.itemsToScroll;
    container.scrollLeft += scrollAmount;
  }
}
