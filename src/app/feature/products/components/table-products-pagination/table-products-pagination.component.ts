import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product-model';
import { PaginationModel } from 'src/app/shared/models/pagination-model';

@Component({
  selector: 'app-table-products-pagination',
  templateUrl: './table-products-pagination.component.html',
  styleUrls: ['./table-products-pagination.component.scss']
})
export class TableProductsPaginationComponent {

  @Input() products = <Product[]>[];
  @Input() pagination = new PaginationModel();
  @Input() filters: any = new Object();
  @Output() paginationChanged = new EventEmitter();

  get pagesCount(): number[] {
    const totalPages = Math.ceil(this.pagination.totalElements / this.pagination.size);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  get isPreviousPageDisabled(): boolean {
    return (
      this.isUndefined(this.filters.page) ||
      parseInt(this.filters.page.toString()) == 1
    );
  }

  get isNextPageDisabled(): boolean {
    return (
      this.isUndefined(this.filters.page) ||
      parseInt(this.filters.page.toString()) ==
        this.max(this.pagesCount)
    );
  }

  previousPage() {
    if (typeof this.filters.page != 'number') {
      return;
    }

    this.filters.page--;
    this.paginationChanged.emit();
  }

  nextPage() {
    if (typeof this.filters.page != 'number') {
      return;
    }

    this.filters.page++;
    this.paginationChanged.emit();
  }

  selectPaginationChanged() {
    this.filters.page = parseInt(
      this.filters.page?.toString() || '1'
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
