import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FieldFilterComponent } from '../../../../shared/components/field-filter/field-filter.component';
import { FilterType } from 'src/app/shared/enums/filter-type.enum';
import { GenericFilter } from '../../models/filter-types';

@Component({
  selector: 'app-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
  imports: [MatListModule, FieldFilterComponent],
})
export class ProductsFilterComponent {
  @Input() productFilters: GenericFilter[] = [];
  @Input() categoryFilters: GenericFilter[] = [];

  @Output() filterChange = new EventEmitter<GenericFilter>();

  onFilterUpdated(updatedFilter: GenericFilter) {
    this.filterChange.emit(updatedFilter);
  }
}
