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
    
    this.filterUpdated.emit(this.filter);
  }
}
