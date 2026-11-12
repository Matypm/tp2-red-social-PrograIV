import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth-service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private authService = inject(AuthService);

  protected readonly title = signal('frontend');

  constructor() {
    this.authService.cargarUsuario();
  }
}
