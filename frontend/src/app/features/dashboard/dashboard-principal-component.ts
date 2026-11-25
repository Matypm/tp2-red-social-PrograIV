import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-dashboard-principal-component',
  styleUrl: './dashboard-principal-component.css',
  templateUrl: './dashboard-principal-component.html',
})
export class DashboardPrincipalComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;

  volverAPublicaciones(){
    this.router.navigate(['/publicaciones'])
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }

  irAUsuarios(){
    this.router.navigate(['/dashboard/usuarios']);
  }

  irAEstadisticas(){
    this.router.navigate(['/dashboard/estadisticas']);
  }

}
