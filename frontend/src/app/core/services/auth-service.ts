import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api-service';
import { LoginInterface } from '../interfaces/login.interface';
import { RegisterInterface } from '../interfaces/register.interface';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RespuestaAuth } from '../interfaces/rta.auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiService = inject(ApiService);
    private router = inject(Router);

    currentUser = signal<any | null>(null);
    currentPerfil = signal<any | null>(null);

    signIn(datos: LoginInterface) {
        return this.apiService.post<RespuestaAuth>('login', datos);
    }

    signUp(datos: RegisterInterface) {
        const formData = new FormData();

        formData.append('nombre', datos.nombre);
        formData.append('apellido', datos.apellido);
        formData.append('correo', datos.correo);
        formData.append('nombre_usuario', datos.nombre_usuario);
        formData.append('contrasenia', datos.contrasenia);
        formData.append('repetir_contrasenia', datos.repetir_contrasenia);
        formData.append('fecha_nacimiento', datos.fecha_nacimiento);
        formData.append('descripcion', datos.descripcion);

        if (datos.img_perfil) {
            formData.append('img_perfil', datos.img_perfil);
        }

        return this.apiService.post<RespuestaAuth>('register', formData);
    }

    guardarUsuario(usuario: any) {
        this.currentUser.set(usuario);
        this.currentPerfil.set(usuario.perfil);
    }

    cerrarSesion(): void {
        this.apiService.post('logout', {}).subscribe({
            next: () => {
                this.finalizarCierreSesion();
            },
            error: () => {
                this.finalizarCierreSesion();
            }
        });
    }

    private finalizarCierreSesion(): void {
        this.limpiarSesion();
        this.router.navigate(['/login']);
    }

    limpiarSesion(): void {
        this.currentUser.set(null);
        this.currentPerfil.set(null);
    }

    async restaurarSesion(): Promise<void> {
        try {
            // firstValueFrom() convierte el Observable de Angular en una Promise
            // autorizar consulta al backend y envía la cookie automáticamente
            const respuesta = await firstValueFrom(
                this.apiService.post<any>('autorizar', {})
            );

            // Si el JWT es válido, guarda el usuario en las señales
            this.guardarUsuario(respuesta);

        } catch (error) {
            // Si falla la petición, limpia el estado y deja al usuario sin sesión
            this.limpiarSesion();
        }
    }
}
