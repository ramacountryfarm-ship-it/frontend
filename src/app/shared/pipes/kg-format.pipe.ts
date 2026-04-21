import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kgFormat'
})
export class KgFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '0 g';
    }
    const kg = Math.floor(value);
    const grams = Math.round((value - kg) * 1000);

    if (kg === 0 && grams === 0) {
      return '0 g';
    }
    if (kg === 0) {
      return `${grams} g`;
    }
    if (grams === 0) {
      return `${kg} kg`;
    }
    return `${kg} kg ${grams} g`;
  }
}
