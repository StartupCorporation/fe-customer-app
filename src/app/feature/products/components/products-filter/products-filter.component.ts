import { Component, EventEmitter, Input, OnChanges, OnInit, OnDestroy, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FieldFilterComponent } from '../../../../shared/components/field-filter/field-filter.component';
import { FilterType } from 'src/app/shared/enums/filter-type.enum';
import { GenericFilter } from '../../models/filter-types';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss'],
  imports: [MatListModule, FieldFilterComponent],
})
export class ProductsFilterComponent implements OnInit, OnDestroy {
  @Input() productFilters: GenericFilter[] = [];
  @Input() categoryFilters: GenericFilter[] = [];
  @Output() filterChange = new EventEmitter<GenericFilter>();

  private destroy$ = new Subject<void>();
  private filterQueue$ = new Subject<GenericFilter>();
  private lastEmittedFilter: string | null = null;

  ngOnInit() {
    // Batch filter changes with debounceTime
    this.filterQueue$.pipe(
      takeUntil(this.destroy$),
      debounceTime(100) // Wait for any rapid sequential changes
    ).subscribe(filter => {
      // Create a unique string representation of the filter
      const filterId = JSON.stringify(filter);
      if (this.lastEmittedFilter !== filterId) {
        this.lastEmittedFilter = filterId;
        this.filterChange.emit(filter);
      }
    });
  }

  onFilterUpdated(updatedFilter: GenericFilter) {
    // Queue filter changes instead of emitting immediately
    this.filterQueue$.next(updatedFilter);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.filterQueue$.complete();
  }
}
