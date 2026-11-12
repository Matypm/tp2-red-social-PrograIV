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

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.cargando.set(true);
    this.error.set(''); // Por si hubo un error antes entonces lo limpio aca.

    this.publicacionesService.listar
      ({ orden: 'fecha', offset: 0, limit: 10 })
      .subscribe({
        next: (respuesta) => {
          this.publicaciones.set(respuesta.publicaciones);
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

}
