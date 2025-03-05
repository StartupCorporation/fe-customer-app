import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product-model';
import { TruncateNumberPipe } from "../../../../shared/pipes/truncate-number.pipe";

@Component({
  selector: 'app-products-detail-description',
  templateUrl: './products-detail-description.component.html',
  styleUrls: ['./products-detail-description.component.scss'],
  imports: [TruncateNumberPipe]
})
export class ProductsDetailDescriptionComponent implements OnInit {

  @Input() product = new Product();

  constructor() { }

  ngOnInit() {
  }

}
