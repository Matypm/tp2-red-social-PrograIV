import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicacionesService } from '../../core/services/publicaciones-service';
import { PublicacionInterface } from '../../core/interfaces/publicaciones.interface';
import { PublicacionComponent } from './publicacion/publicacion-component';

@Component({
  imports: [RouterLink, PublicacionComponent],
  selector: 'app-publicaciones-component',
  styleUrl: './publicaciones-component.css',
  templateUrl: './publicaciones-component.html',
})
export class PublicacionesComponent implements OnInit {

  private publicacionesService = inject(PublicacionesService);

  publicaciones = signal<PublicacionInterface[]>([]);
  cargando = signal(false);
  error = signal('');

  orden = signal<'fecha' | 'likes'>('fecha');

  paginaActual = signal(0);
  limite = 10;
  totalPublicaciones = signal(0);
  Math = Math;

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  cambiarOrden(nuevoOrden: 'fecha' | 'likes'): void {
    this.orden.set(nuevoOrden);
    this.paginaActual.set(0);
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.cargando.set(true);
    this.error.set(''); // Por si hubo un error antes entonces lo limpio aca.

    this.publicacionesService.listar
      ({ orden: this.orden(), offset: this.paginaActual() * this.limite, limit: this.limite })
      .subscribe({
        next: (respuesta) => {
          this.publicaciones.set(respuesta.publicaciones);
          this.totalPublicaciones.set(respuesta.total);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar las publicaciones', error);
          this.error.set('No se pudieron cargar las publicaciones.');
          this.cargando.set(false);
        }
      });
  }

  actualizarPublicacion(publicacionActualizada: PublicacionInterface): void {
    const publicacionesActuales = this.publicaciones();

    const publicacionesActualizadas = publicacionesActuales.map(
      (publicacion) => {
        if (publicacion._id === publicacionActualizada._id) {
          return publicacionActualizada;
        }

        return publicacion;
      }
    );

    this.publicaciones.set(publicacionesActualizadas);
  }

  eliminarPublicacion(publicacionId: string): void {

    const publicacionesActuales = this.publicaciones();

    const publicacionesActualizadas = publicacionesActuales.filter(
      (publicacion) => publicacion._id !== publicacionId
    );

    this.publicaciones.set(publicacionesActualizadas);

  }

  paginaSiguiente(): void {
    if ((this.paginaActual() + 1) * this.limite < this.totalPublicaciones()) {
      this.paginaActual.update(pagina => pagina + 1);
      this.cargarPublicaciones();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual() > 0) {
      this.paginaActual.update(pagina => pagina - 1);
      this.cargarPublicaciones();
    }
  }

}
