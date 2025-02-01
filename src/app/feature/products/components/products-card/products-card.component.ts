import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product-model';
import { TruncateNumberPipe } from "../../../../shared/pipes/truncate-number.pipe";

@Component({
  selector: 'app-products-card',
  templateUrl: './products-card.component.html',
  styleUrls: ['./products-card.component.scss'],
  imports: [TruncateNumberPipe]
})
export class ProductsCardComponent implements OnInit {

  @Input() product: Product = new Product();

  ngOnInit() {
  }

  getImageName(name: string) {
    return `http://localhost:9999/images/deye-admin-files/${name}`;
  }

}
