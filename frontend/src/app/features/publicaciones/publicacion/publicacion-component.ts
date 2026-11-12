import { Component, inject, input, output, signal } from '@angular/core';
import { PublicacionInterface } from '../../../core/interfaces/publicaciones.interface';
import { AuthService } from '../../../core/services/auth-service';
import { PublicacionesService } from '../../../core/services/publicaciones-service';

@Component({
  imports: [],
  selector: 'app-publicacion-component',
  styleUrl: './publicacion-component.css',
  templateUrl: './publicacion-component.html',
})
export class PublicacionComponent {

  authService = inject(AuthService);
  private publicacionesService = inject(PublicacionesService);


  publicacion = input.required<PublicacionInterface>();

  publicacionActualizada = output<PublicacionInterface>();

  procesandoLike = signal(false);

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

}
