import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales',
})
export class InicialesPipe implements PipeTransform {

  transform(nombre: string | null | undefined, apellido?: string | null): string {
    if (!nombre) {
      return '';
    }

    const inicialNombre = nombre.trim().charAt(0).toUpperCase();
    const inicialApellido = apellido?.trim().charAt(0).toUpperCase() || '';

    return inicialNombre + inicialApellido;
  }
}
