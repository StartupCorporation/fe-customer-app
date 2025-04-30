import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Product, ProductImage } from '../../models/product-model';
import { TruncateNumberPipe } from "../../../../shared/pipes/truncate-number.pipe";
import { Router } from '@angular/router';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-products-card',
  templateUrl: './products-card.component.html',
  styleUrls: ['./products-card.component.scss'],
  standalone: true,
  imports: [CommonModule, TruncateNumberPipe]
})
export class ProductsCardComponent implements OnInit {
  private router = inject(Router);
  private imageService = inject(ImageService);

  @Input() product: Product = new Product();

  ngOnInit() {
  }

  getFirstImageByOrder(): ProductImage | undefined {
    if (!this.product.images || this.product.images.length === 0) {
      return undefined;
    }

    // Sort images by order (if order is defined)
    const sortedImages = [...this.product.images].sort((a, b) => {
      // If order is undefined, treat it as highest order
      const orderA = a.order !== undefined ? a.order : Number.MAX_SAFE_INTEGER;
      const orderB = b.order !== undefined ? b.order : Number.MAX_SAFE_INTEGER;

      return orderA - orderB;
    });

    return sortedImages[0];
  }

  getImageName(image: ProductImage | undefined) {
    if (!image) {
      return 'assets/images/product-image.png'; // Default to Figma image
    }

    // Check if the link starts with http - if so use it directly
    if (image.link.startsWith('http')) {
      return image.link;
    }

    const imageContainerLinkUrl = `${this.imageService.getImageContainerUrl()}/${image.link}`

    // Otherwise prepend the base URL
    return imageContainerLinkUrl;
  }

  redirectToDetailPage() {
    this.router.navigate([`/products/${this.product.id}`]);
  }
}
