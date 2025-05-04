import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product-model';
import { PaginationModel } from 'src/app/shared/models/pagination-model';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-products-pagination',
  templateUrl: './table-products-pagination.component.html',
  styleUrls: ['./table-products-pagination.component.scss'],
  imports:[
    NgFor,
    FormsModule
  ]
})
export class TableProductsPaginationComponent {

  @Input() products = <Product[]>[];
  @Input() pagination = new PaginationModel();
  @Output() paginationChanged = new EventEmitter();

  get pagesCount(): number[] {
    const totalPages = Math.ceil(this.pagination.totalElements / this.pagination.size);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  get totalProducts(): number {
    return this.pagination.totalElements;
  }

  get isPreviousPageDisabled(): boolean {
    return this.pagination.page + 1 <= 1;
  }

  get isNextPageDisabled(): boolean {
    return this.pagination.page + 1 >= this.pagesCount.length;
  }

  previousPage() {
    if (this.pagination.page + 1 > 1) {
      this.pagination.page--;
      this.paginationChanged.emit();
    }
  }

  nextPage() {
    if (this.pagination.page < this.pagesCount.length) {
      this.pagination.page++;
      this.paginationChanged.emit();
    }
  }

  goToPage(page: number) {
    if (page !== this.pagination.page + 1) {
      this.pagination.page = page - 1;
      this.paginationChanged.emit();
    }
  }

  selectPaginationChanged() {
    this.pagination.page = parseInt(
      this.pagination.page?.toString() || '1'
    );
    this.paginationChanged.emit();
  }

  isUndefined(value: any): boolean {
    return typeof value === 'undefined';
  }

  max(values: number[] | null | undefined): number | undefined {
    if (!values || values.length === 0) {
      return undefined;
    }
    return Math.max(...values);
  }

}
