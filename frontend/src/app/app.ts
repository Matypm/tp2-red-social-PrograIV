import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth-service';
import { Modal } from './shared/components/modal';

@Component({
  imports: [RouterOutlet, Modal],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  protected readonly title = signal('frontend');

  private authService = inject(AuthService);

  mostrarAvisoDeSesion(): boolean{
    return this.authService.avisoDeSesion();
  }

  extenderSesion(): void {
    this.authService.extenderSesion().subscribe();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
