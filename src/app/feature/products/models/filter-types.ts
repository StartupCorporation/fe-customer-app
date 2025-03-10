import { FilterType } from 'src/app/shared/enums/filter-type.enum';

export interface CheckboxFilter {
  label: string;
  type: FilterType;
  value: boolean;
}

export interface RangeFilter {
  label: string;
  type: FilterType;
  valueStart: number;
  valueEnd: number;
  minRange: number;
  maxRange: number;
  step: number;
}

export interface StringFilter {
  label: string;
  type: FilterType;
  value: string;
}

export type GenericFilter = CheckboxFilter | RangeFilter | StringFilter;