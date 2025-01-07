import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeArray',
})
export class SafeArrayPipe implements PipeTransform {
  transform(value: any): any[] {
    return Array.isArray(value) ? value : [];
  }
}
