import { Component, inject, input, output, signal } from '@angular/core';
import { PublicacionInterface } from '../../../core/interfaces/publicaciones.interface';
import { ComentariosService } from '../../../core/services/comentarios-service';
import { ComentarioInterface } from '../../../core/interfaces/comentario.interface';

@Component({
  imports: [],
  selector: 'app-detalle-publicacion',
  styleUrl: './detalle-publicacion.css',
  templateUrl: './detalle-publicacion.html',
})
export class DetallePublicacion {

  private comentariosService = inject(ComentariosService);

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

        // Vuelve a consultar la primera página para incluir el nuevo comentario
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

}
