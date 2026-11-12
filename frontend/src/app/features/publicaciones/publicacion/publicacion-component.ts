import { Component, inject, input, output, signal } from '@angular/core';
import { PublicacionInterface } from '../../../core/interfaces/publicaciones.interface';
import { AuthService } from '../../../core/services/auth-service';
import { PublicacionesService } from '../../../core/services/publicaciones-service';
import { Modal } from '../../../shared/components/modal';

@Component({
  imports: [Modal],
  selector: 'app-publicacion-component',
  styleUrl: './publicacion-component.css',
  templateUrl: './publicacion-component.html',
})
export class PublicacionComponent {

  authService = inject(AuthService);
  private publicacionesService = inject(PublicacionesService);


  publicacion = input.required<PublicacionInterface>();

  publicacionActualizada = output<PublicacionInterface>();
  publicacionEliminada = output<string>();

  procesandoLike = signal(false);
  procesandoEliminacion = signal(false);
  mostrarModalEliminar = signal(false);

  abrirModalEliminar(): void {
    this.mostrarModalEliminar.set(true);
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar.set(false);
  }

  darOSacarLike(): void {

    // 1. Obtenemos el ID del usuario conectado.
    const usuario = this.authService.currentUser();

    if (usuario === null) {
      return;
    }

    const usuarioId = usuario._id;

    // 2. Evitamos que el usuario haga varios clics
    // mientras se procesa una petición.
    if (this.procesandoLike() === true) {
      return;
    }

    // 3. Obtenemos la publicación actual.
    const publicacion = this.publicacion();

    // 4. Comprobamos si el usuario ya dio like.
    const yaDioLike = publicacion.likes.includes(usuarioId);

    // 5. Indicamos que estamos procesando la petición.
    this.procesandoLike.set(true);

    // 6. Si ya había dado like, lo quitamos.
    if (yaDioLike === true) {

      this.publicacionesService
        .sacarLike(publicacion._id, usuarioId)
        .subscribe({
          next: () => {
            // Crea un nuevo array sin el ID del usuario
            const nuevosLikes = publicacion.likes.filter(
              (id) => id !== usuarioId
            );

            // Crea una copia de la publicación actualizada
            const publicacionActualizada = {
              ...publicacion,
              likes: nuevosLikes,
              cantidad_likes: nuevosLikes.length
            };

            // Avisa al componente padre.
            this.publicacionActualizada.emit(publicacionActualizada);

            this.procesandoLike.set(false);
          },

          error: (error) => {
            console.error('Error al quitar el like:', error);
            this.procesandoLike.set(false);
          }

        });

    }

    // 7. Si todavía no había dado like lo agrega
    else {

      this.publicacionesService
        .darLike(publicacion._id, usuarioId)
        .subscribe({

          next: () => {

            // Crea un nuevo array agregando el ID del usuario
            const nuevosLikes = [
              ...publicacion.likes,
              usuarioId
            ];

            // Crea una copia de la publicación actualizada
            const publicacionActualizada = {
              ...publicacion,
              likes: nuevosLikes,
              cantidad_likes: nuevosLikes.length
            };

            // Avisa al componente padre
            this.publicacionActualizada.emit(publicacionActualizada);

            this.procesandoLike.set(false);
          },

          error: (error) => {
            console.error('Error al dar like:', error);
            this.procesandoLike.set(false);
          }

        });

    }

  }

  eliminarPublicacion(): void {

    // 1 Obtiene el usuario conectado
    const usuario = this.authService.currentUser();

    if (usuario === null) {
      return;
    }

    const usuarioId = usuario._id;

    // 2 Evita múltiples clics
    if (this.procesandoEliminacion() === true) {
      return;
    }

    // 3 Obtiene la publicación actual
    const publicacion = this.publicacion();

    // 4 Indica que esta procesando
    this.procesandoEliminacion.set(true);

    // 5 Envia la petición al backend
    this.publicacionesService
      .eliminarPublicacion(publicacion._id, usuarioId)
      .subscribe({

        next: () => {
          this.publicacionEliminada.emit(publicacion._id);
          this.mostrarModalEliminar.set(false);
          this.procesandoEliminacion.set(false);
        },

        error: (error) => {
          console.error('Error al eliminar la publicación:', error);
          this.mostrarModalEliminar.set(false);
          this.procesandoEliminacion.set(false);
        }

      });

  }

}
