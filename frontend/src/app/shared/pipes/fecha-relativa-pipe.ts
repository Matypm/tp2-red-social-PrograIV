import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaRelativa',
})
export class FechaRelativaPipe implements PipeTransform {

  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    const fecha = new Date(value);
    const ahora = new Date();

    const diferencia = ahora.getTime() - fecha.getTime();

    if (isNaN(fecha.getTime()) || diferencia < 0) {
      return 'Fecha inválida';
    }

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (segundos < 60) {
      return 'hace unos segundos';
    }

    if (minutos < 60) {
      return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    }

    if (horas < 24) {
      return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    }

    if (dias < 30) {
      return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    }

    const meses = Math.floor(dias / 30);

    if (meses < 12) {
      return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }

    const anios = Math.floor(dias / 365);

    return `hace ${anios} ${anios === 1 ? 'año' : 'años'}`;
  }
}
