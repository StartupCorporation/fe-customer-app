import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FilterType } from '../../enums/filter-type.enum';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

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
export class FieldFilterComponent implements OnInit, OnDestroy {
  @Input() filter!: any;
  @Output() filterUpdated = new EventEmitter<any>();

  FilterType = FilterType;
  private valueChanges$ = new Subject<void>();
  private destroy$ = new Subject<void>();
  private pendingRangeChange = false;
  // Add temporary storage for values during editing
  private tempValue: [number, number] = [0, 0];
  private isEditing = false;
  private currentEditingIndex: number = -1; // Track which input is being edited

  ngOnInit() {
    // Debounce value changes to prevent multiple rapid emissions
    this.valueChanges$.pipe(
      takeUntil(this.destroy$),
      debounceTime(200) // Wait 200ms for values to settle
    ).subscribe(() => {
      this.emitFilterUpdate();
    });
  }

  ngOnChanges() {
  }

  // When an input gets focus, store the current value for potential rollback
  onRangeInputFocus(index: number): void {
    this.currentEditingIndex = index;
    this.isEditing = true;
    
    // Save the current value in case we need to restore it
    if (this.filter.type === FilterType.RANGE) {
      this.tempValue = [...this.filter.value] as [number, number];
    }
  }

  // For numeric inputs: allow free editing without validation
  onRangeInputChange(): void {
    if (this.filter.type === FilterType.RANGE) {
      this.pendingRangeChange = true;
      
      // Allow empty values during editing
      if (this.currentEditingIndex === 0 || this.currentEditingIndex === 1) {
        // If the user is editing and has deleted the value, don't apply constraints yet
        if (this.filter.value[this.currentEditingIndex] === '' || 
            this.filter.value[this.currentEditingIndex] === null || 
            this.filter.value[this.currentEditingIndex] === undefined) {
          // Empty is fine while editing
          return;
        }
        
        // Convert to number if it's a string
        if (typeof this.filter.value[this.currentEditingIndex] === 'string') {
          // Don't parse float yet - leave as string during editing
          // We'll parse when the user finishes editing
        }
      }
    }
  }
  
  // Only emit when the input loses focus, and apply validation
  onRangeInputBlur(): void {
    if (this.filter.type === FilterType.RANGE && this.pendingRangeChange) {
      // Now that editing is complete, apply validation
      this.isEditing = false;
      
      // Parse the values as numbers
      if (typeof this.filter.value[0] === 'string') {
        this.filter.value[0] = parseFloat(this.filter.value[0]) || this.filter.minRange || 0;
      }
      
      if (typeof this.filter.value[1] === 'string') {
        this.filter.value[1] = parseFloat(this.filter.value[1]) || this.filter.maxRange || 1000;
      }
      
      // Handle empty or NaN values
      if (isNaN(this.filter.value[0])) {
        this.filter.value[0] = this.filter.minRange || 0;
      }
      
      if (isNaN(this.filter.value[1])) {
        this.filter.value[1] = this.filter.maxRange || 1000;
      }
      
      // Special handling for max value validation - only apply min constraints if not the max input
      if (this.currentEditingIndex === 0 && this.filter.value[0] > this.filter.value[1]) {
        // If editing min value and it exceeds max, cap it
        this.filter.value[0] = this.filter.value[1];
      } else if (this.currentEditingIndex === 1 && this.filter.value[1] < this.filter.value[0]) {
        // If editing max value and it's less than min, don't cap it immediately
        // This allows users to type a lower value temporarily
        // We'll only enforce if they move away from the field completely
        if (!this.isEditing) {
          this.filter.value[1] = Math.max(this.filter.value[0], this.filter.value[1]);
        }
      }
      
      // Ensure values are within global bounds
      this.filter.value[0] = Math.max(this.filter.minRange || 0, Math.min(this.filter.value[0], this.filter.maxRange));
      this.filter.value[1] = Math.max(this.filter.minRange || 0, Math.min(this.filter.value[1], this.filter.maxRange));
      
      // Reset tracking variables
      this.currentEditingIndex = -1;
      
      // Emit changes now that validation is complete
      this.valueChanges$.next();
      this.pendingRangeChange = false;
    }
  }

  // Used for slider and other controls that should emit immediately
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
    
    // Emit changes immediately for non-numeric inputs and sliders
    this.valueChanges$.next();
  }

  private emitFilterUpdate(): void {
    this.filterUpdated.emit(this.filter);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.valueChanges$.complete();
  }
}
