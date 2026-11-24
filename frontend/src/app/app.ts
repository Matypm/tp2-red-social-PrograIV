import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth-service';
import { Modal } from './shared/components/modal';
import { Cargando } from './shared/components/cargando';

@Component({
  imports: [RouterOutlet, Modal, Cargando],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App{

  protected readonly title = signal('frontend');

  private authService = inject(AuthService);

  cargando = signal(false);

  mostrarAvisoDeSesion(): boolean{
    return this.authService.avisoDeSesion();
  }

  extenderSesion(): void {
    this.authService.extenderSesion().subscribe();
  }

  cerrarAvisoSesion() {
    this.authService.avisoDeSesion.set(false);
  }

  // cerrarSesion(): void {
  //   this.authService.cerrarSesion();
  // }
}
