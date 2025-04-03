import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Product } from '../../models/product-model';
import { TruncateNumberPipe } from "../../../../shared/pipes/truncate-number.pipe";

@Component({
  selector: 'app-products-detail-description',
  templateUrl: './products-detail-description.component.html',
  styleUrls: ['./products-detail-description.component.scss'],
  imports: [TruncateNumberPipe, NgClass],
  standalone: true
})
export class ProductsDetailDescriptionComponent implements OnInit {

  @Input() product = new Product();
  @Output() addToCart = new EventEmitter<Product>();
  @Output() showCharacteristics = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  onOrderClick(): void {
    this.addToCart.emit(this.product);
  }
  
  onCharacteristicsClick(): void {
    this.showCharacteristics.emit();
  }

  /**
   * Returns the appropriate CSS class based on the price value
   * @param price - The product price
   */
  getPriceClass(price: number): string {
      return 'price-large'; // Large numbers (6 digits)
  }
}
