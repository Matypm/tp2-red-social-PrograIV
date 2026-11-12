import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { PublicacionesService } from '../../core/services/publicaciones-service';
import { PublicacionInterface } from '../../core/interfaces/publicaciones.interface';
import { PublicacionComponent } from '../publicaciones/publicacion/publicacion-component';

@Component({
  imports: [RouterLink, PublicacionComponent],
  selector: 'app-mi-perfil-component',
  styleUrl: './mi-perfil-component.css',
  templateUrl: './mi-perfil-component.html',
})
export class MiPerfilComponent implements OnInit {
  authService = inject(AuthService);

  private publicacionesService = inject(PublicacionesService);

  misPublicaciones = signal<PublicacionInterface[]>([]);
  cargandoPublicaciones = signal(false);
  errorPublicaciones = signal('');


  ngOnInit(): void {
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones(): void {
    const usuario = this.authService.currentUser();

    if (!usuario) {
      return;
    }

    this.cargandoPublicaciones.set(true);
    this.errorPublicaciones.set('');

    this.publicacionesService.listar({
      usuarioId: usuario._id,
      orden: 'fecha',
      offset: 0,
      limit: 3
    }).subscribe({
      next: (respuesta) => {
        this.misPublicaciones.set(respuesta.publicaciones);
        this.cargandoPublicaciones.set(false);
      },
      error: (error) => {
        console.error('Error al cargar mis publicaciones:', error);
        this.errorPublicaciones.set('No se pudieron cargar tus publicaciones.');
        this.cargandoPublicaciones.set(false);
      }
    });
  }

  actualizarPublicacion(publicacionActualizada: PublicacionInterface): void {
    const publicacionesActuales = this.misPublicaciones();

    const publicacionesActualizadas = publicacionesActuales.map(
      (publicacion) => {
        if (publicacion._id === publicacionActualizada._id) {
          return publicacionActualizada;
        }

        return publicacion;
      }
    );

    this.misPublicaciones.set(publicacionesActualizadas);
  }

  quitarPublicacion(publicacionId: string): void {
    const publicacionesActuales = this.misPublicaciones();

    const publicacionesActualizadas = publicacionesActuales.filter(
      (publicacion) => publicacion._id !== publicacionId
    );

    this.misPublicaciones.set(publicacionesActualizadas);
  }
}
