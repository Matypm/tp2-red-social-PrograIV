import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.css',
  templateUrl: './modal.html',
})
export class Modal {
  titulo = input<string>('');
  mensaje = input<string>('');
  tipo = input<'error' | 'exito' | 'info'>('info');

  confirmacion = input<boolean>(false);

  cerrar = output<void>();
  confirmar = output<void>(); 
}
