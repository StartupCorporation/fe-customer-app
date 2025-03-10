import { Component, Input, OnInit } from '@angular/core';
import { ProductsCardComponent } from "../products-card/products-card.component";
import { Product } from '../../models/product-model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [ProductsCardComponent]
})
export class ProductsListComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() isLoading = false;

  ngOnInit() {
  }

}
