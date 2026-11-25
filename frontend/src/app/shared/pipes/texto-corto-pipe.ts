import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textoCorto',
})
export class TextoCortoPipe implements PipeTransform {

  transform(value: string | null | undefined, limite: number = 100): string {
    if (!value) {
      return '';
    }

    if (value.length <= limite) {
      return value;
    }

    return value.slice(0, limite).trimEnd() + '...';
  }
}
