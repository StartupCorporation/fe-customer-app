import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AttributeDefinition {
  attributeType: string;
  values?: (string | number)[];
  min?: number;
  max?: number;
}

interface RangeValue {
  min: number;
  max: number;
}

interface ProductAttribute {
  id: string;
  name: string;
  description: string;
  definition: AttributeDefinition;
  value: string | number | RangeValue;
}

@Component({
  selector: 'app-products-characteristics-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-characteristics-table.component.html',
  styleUrls: ['./products-characteristics-table.component.scss']
})
export class ProductsCharacteristicsTableComponent {
  @Input() attributes: ProductAttribute[] = [];

  getAttributeValueAsString(attribute: ProductAttribute): string {
    if (attribute.definition.attributeType === 'RANGE' && typeof attribute.value === 'object') {
      const rangeValue = attribute.value as RangeValue;
      return `${rangeValue.min} - ${rangeValue.max}`;
    }
    return String(attribute.value);
  }

  getAttributeType(attribute: ProductAttribute): string {
    switch (attribute.definition.attributeType) {
      case 'STRING':
        return 'Текст';
      case 'NUMBER':
        return 'Число';
      case 'NUMBER_SELECT':
        return 'Числовий вибір';
      case 'STRING_SELECT':
        return 'Текстовий вибір';
      case 'RANGE':
        return 'Діапазон';
      default:
        return attribute.definition.attributeType;
    }
  }
}
