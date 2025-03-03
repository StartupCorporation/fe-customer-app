import { Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product-model';
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

  getImageName(name: string) {
    return `http://localhost:9999/images/${name}`;
  }

  redirectToDetailPage() {
    this.router.navigate([`/products/${this.product.id}`]);
  }
}
