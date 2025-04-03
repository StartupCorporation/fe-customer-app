import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateNumber',
  standalone: true
})
export class TruncateNumberPipe implements PipeTransform {

  transform(value: number, decimals: number = 0): string {
    if (!value && value !== 0) return '';

    // Truncate the decimal places without rounding
    const factor = Math.pow(10, decimals);
    const truncatedValue = Math.floor(value * factor) / factor;
    
    // Format with spaces as thousand separators - always show complete number
    const parts = truncatedValue.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Add spaces between thousands
    
    return parts.join('.') + ' грн';
  }
}
