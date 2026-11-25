import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ApiService } from '../../../core/services/api-service';
import { ChartData, ChartOptions } from 'chart.js';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';

interface PublicacionesPorUsuario {
  nombre_usuario: string;
  cantidad: number;
}

interface ComentariosPorDia {
  fecha: string;
  cantidad: number;
}

interface ComentariosPorPublicacion {
  titulo: string;
  cantidad: number;
}

@Component({
  imports: [FormsModule, BaseChartDirective, RouterLink],
  selector: 'app-estadisticas-admin-component',
  styleUrl: './estadisticas-admin-component.css',
  templateUrl: './estadisticas-admin-component.html',
})
export class EstadisticasAdminComponent {
  private apiService = inject(ApiService);

  fechaDesde = '';
  fechaHasta = '';

  cargando = signal(false);
  error = signal('');

  // Gráfico de publicaciones por usuario.
  publicacionesData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Publicaciones realizadas',
        data: [],
      },
    ],
  };

  publicacionesOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Gráfico de comentarios por día.
  comentariosData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Comentarios realizados',
        data: [],
        tension: 0.3,
      },
    ],
  };

  comentariosOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  // Gráfico de comentarios por publicación.
  comentariosPublicacionData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  comentariosPublicacionOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
  };

  consultarEstadisticas() {
    if (!this.fechaDesde || !this.fechaHasta) {
      this.error.set('Debés seleccionar ambas fechas.');
      return;
    }

    if (this.fechaDesde > this.fechaHasta) {
      this.error.set('La fecha desde no puede ser posterior a la fecha hasta.');
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const params = {
      fechaDesde: this.fechaDesde,
      fechaHasta: this.fechaHasta,
    };

    forkJoin({
      publicaciones: this.apiService.get<PublicacionesPorUsuario[]>(
        'publicaciones/estadisticas/publicaciones-por-usuario',
        params
      ),
      comentarios: this.apiService.get<ComentariosPorDia[]>(
        'publicaciones/estadisticas/cantidad-comentarios',
        params
      ),
      comentariosPorPublicacion: this.apiService.get<ComentariosPorPublicacion[]>(
        'publicaciones/estadisticas/comentarios-por-publicacion',
        params
      ),
    }).subscribe({
      next: respuesta => {
        this.publicacionesData = {
          labels: respuesta.publicaciones.map(item => item.nombre_usuario),
          datasets: [
            {
              label: 'Publicaciones realizadas',
              data: respuesta.publicaciones.map(item => item.cantidad),
            },
          ],
        };

        this.comentariosData = {
          labels: respuesta.comentarios.map(item => item.fecha),
          datasets: [
            {
              label: 'Comentarios realizados',
              data: respuesta.comentarios.map(item => item.cantidad),
              tension: 0.3,
            },
          ],
        };

        this.comentariosPublicacionData = {
          labels: respuesta.comentariosPorPublicacion.map(item => item.titulo),
          datasets: [
            {
              data: respuesta.comentariosPorPublicacion.map(item => item.cantidad),
            },
          ],
        };

        this.cargando.set(false);
      },
      error: error => {
        console.error('Error al obtener estadísticas:', error);
        this.error.set('No se pudieron cargar las estadísticas.');
        this.cargando.set(false);
      },
    });
  }

}
