import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api-service';

@Component({
  imports: [],
  selector: 'app-usuarios-admin-component',
  styleUrl: './usuarios-admin-component.css',
  templateUrl: './usuarios-admin-component.html',
})
export class UsuariosAdminComponent {

  private apiService = inject(ApiService);

  usuarios = signal<any[]>([]);
  cargando = signal(true);
  error = signal(false);

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios() {
    this.cargando.set(true);
    this.error.set(false);

    this.apiService.get<any[]>('usuarios').subscribe({
      next: respuesta => {
        console.log('Usuarios obtenidos:', respuesta);

        this.usuarios.set(respuesta);
        this.cargando.set(false);
      },
      error: error => {
        console.error('Error al obtener usuarios:', error);

        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  habilitarUsuario(id: string) {
    this.cargando.set(true);
    this.error.set(false);

    this.apiService.post(`usuarios/${id}/habilitar`, {}).subscribe({
      next: () => {
        this.usuarios.update(lista => 
          lista.map(usuario => 
            usuario._id === id ? {...usuario, habilitado: true} : usuario
          )
        )

        this.cargando.set(false);
      },
      error: error => {
        console.log('Error al habilitar usuario.');
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  deshabilitarUsuario(id: string) {
    this.cargando.set(true);
    this.error.set(false);

    this.apiService.delete(`usuarios/${id}`, {}).subscribe({
      next: () => {
        this.usuarios.update(lista =>
          lista.map(usuario => 
            usuario._id === id ? {...usuario, habilitado: false} : usuario
          )
        )

        this.cargando.set(false);
      },
      error: error => {
        console.log('Error al deshabilitar usuario.');
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }
}
