import { Component, inject, Input, OnInit } from '@angular/core';
import { Product, ProductImage } from '../../models/product-model';
import { TruncateNumberPipe } from "../../../../shared/pipes/truncate-number.pipe";
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-card',
  templateUrl: './products-card.component.html',
  styleUrls: ['./products-card.component.scss'],
  imports: [TruncateNumberPipe]
})
export class ProductsCardComponent implements OnInit {
  private router = inject(Router);

  @Input() product: Product = new Product();

  ngOnInit() {
  }

  getImageName(image: ProductImage | undefined) {
    if (!image) {
      return 'assets/images/placeholder.png';
    }
    
    // Check if the link starts with http - if so use it directly
    if (image.link.startsWith('http')) {
      return image.link;
    }
    
    // Otherwise prepend the base URL
    return `http://localhost:9999/images/${image.link}`;
  }

  redirectToDetailPage() {
    this.router.navigate([`/products/${this.product.id}`]);
  }
}
