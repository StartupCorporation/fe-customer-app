import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterType } from '../../enums/filter-type.enum';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-field-filter',
  templateUrl: './field-filter.component.html',
  styleUrls: ['./field-filter.component.scss'],
  imports: [
    MatCheckboxModule,
    MatSliderModule,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    FormsModule
  ],
})
export class FieldFilterComponent {
  @Input() filter!: any;
  @Output() filterUpdated = new EventEmitter<any>();

  FilterType = FilterType;

  ngOnChanges() {
    console.log("Filter came to filter section - " + JSON.stringify(this.filter));
  }

  onValueChanged(): void {
    if (this.filter.type === FilterType.RANGE) {
      // Ensure min value doesn't exceed max value
      if (this.filter.value[0] > this.filter.value[1]) {
        this.filter.value[0] = this.filter.value[1];
      }
      
      // Ensure max value doesn't go below min value
      if (this.filter.value[1] < this.filter.value[0]) {
        this.filter.value[1] = this.filter.value[0];
      }
      
      // Ensure values are within bounds
      this.filter.value[0] = Math.max(this.filter.minRange || 0, Math.min(this.filter.value[0], this.filter.maxRange));
      this.filter.value[1] = Math.max(this.filter.minRange || 0, Math.min(this.filter.value[1], this.filter.maxRange));
    }
    
    this.filterUpdated.emit(this.filter);
  }
}
