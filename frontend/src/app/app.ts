import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth-service';
import { Modal } from './shared/components/modal';

@Component({
  imports: [RouterOutlet, Modal],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit{

  protected readonly title = signal('frontend');

  private authService = inject(AuthService);

  cargando = signal(true);

  async ngOnInit(): Promise<void> {
    await this.authService.restaurarSesion();
    this.cargando.set(false);
  }

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
