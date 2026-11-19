import { Component, inject, input, output, signal } from '@angular/core';
import { PublicacionInterface } from '../../../core/interfaces/publicaciones.interface';
import { ComentariosService } from '../../../core/services/comentarios-service';
import { ComentarioInterface } from '../../../core/interfaces/comentario.interface';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  imports: [],
  selector: 'app-detalle-publicacion',
  styleUrl: './detalle-publicacion.css',
  templateUrl: './detalle-publicacion.html',
})
export class DetallePublicacion {

  private comentariosService = inject(ComentariosService);
  private authService = inject(AuthService);

  publicacion = input.required<PublicacionInterface>();
  
  cerrar = output<void>();

  comentarios = signal<ComentarioInterface[]>([]);
  cargandoComentarios = signal(false);
  errorComentarios = signal('');

  paginaActual = signal(1);
  limiteComentarios = 5;
  hayMasComentarios = signal(true);

  nuevoComentario = signal('');
  publicandoComentario = signal(false);
  errorPublicar = signal('');

  comentarioEditando = signal<string | null>(null);
  mensajeEdicion = signal('');

  ngOnInit(): void {
    this.cargarComentarios();
  }

  cargarComentarios(): void {

    if (this.cargandoComentarios() || !this.hayMasComentarios()) {
      return;
    }

    this.cargandoComentarios.set(true);
    this.errorComentarios.set('');

    this.comentariosService.obtenerComentarios(
      this.publicacion()._id,
      this.paginaActual(),
      this.limiteComentarios
    ).subscribe({

      next: (respuesta) => {

        // Agrega los nuevos comentarios a los que ya tenía
        this.comentarios.update(
          comentariosActuales => [...comentariosActuales, ...respuesta]
        );

        // Si llegaron menos de 5 no hay más comentarios
        if (respuesta.length < this.limiteComentarios) {
          this.hayMasComentarios.set(false);
        }

        this.cargandoComentarios.set(false);
      },

      error: (error) => {
        console.error('Error al cargar comentarios:', error);
        this.errorComentarios.set('No se pudieron cargar los comentarios.');
        this.cargandoComentarios.set(false);
      }

    });

  }

  cargarMasComentarios(): void {
    if (this.hayMasComentarios() && !this.cargandoComentarios()) {
      this.paginaActual.update(pagina => pagina + 1);
      this.cargarComentarios();
    }
  }

  publicarComentario(): void {
    const mensaje = this.nuevoComentario().trim();

    if (!mensaje || this.publicandoComentario()) {
      return;
    }

    this.publicandoComentario.set(true);
    this.errorPublicar.set('');

    this.comentariosService.crearComentario(
      this.publicacion()._id,
      mensaje
    ).subscribe({

      next: () => {
        this.nuevoComentario.set('');
        this.paginaActual.set(1);

        this.comentariosService.obtenerComentarios(
          this.publicacion()._id,
          1,
          this.limiteComentarios
        ).subscribe({

          next: (respuesta) => {
            this.comentarios.set(respuesta);
            this.hayMasComentarios.set(respuesta.length === this.limiteComentarios);
            this.publicandoComentario.set(false);
          },
          error: (error) => {
            console.error('Error al actualizar los comentarios:', error);
            this.errorPublicar.set('El comentario se publicó, pero no se pudo actualizar la lista.');
            this.publicandoComentario.set(false);
          }
        });

      },

      error: (error) => {
        console.error('Error al publicar comentario:', error);
        this.errorPublicar.set('No se pudo publicar el comentario.');
        this.publicandoComentario.set(false);
      }

    });
  }

  // comprueba si el comentario pertenece al usuario autenticado
  esComentarioPropio(comentario: ComentarioInterface): boolean {
    return this.authService.currentUser()?._id === comentario.usuario._id;
  }

  // guarda el ID del comentario que queremos editar y carga su mensaje actual
  iniciarEdicion(comentario: ComentarioInterface): void {
    this.comentarioEditando.set(comentario._id);
    this.mensajeEdicion.set(comentario.mensaje);
  }

  // sale del modo edición sin guardar cambios
  cancelarEdicion(): void {
    this.comentarioEditando.set(null);
    this.mensajeEdicion.set('');
  }

  guardarEdicion(comentarioId: string): void {
    const mensaje = this.mensajeEdicion().trim();

    if (!mensaje) {
      return;
    }

    this.comentariosService.editarComentario(
      comentarioId,
      mensaje
    ).subscribe({

      next: (respuesta) => {
        this.comentarios.update(comentariosActuales =>
          comentariosActuales.map(comentario =>
            // aca con el array de coments q tengo comparo el id del coment
            // q esta en el array con la rta del next, si es el mismo le doy rta
            // si no le doy comentario (caso false)
            comentario._id === respuesta._id
              ? respuesta
              : comentario
          )
        );

        this.cancelarEdicion();
      },
      error: (error) => {
        console.error('Error al editar comentario:', error);
      }
    });
  }


}
