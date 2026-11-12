import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api-service';
import { LoginInterface } from '../interfaces/login.interface';
import { RegisterInterface } from '../interfaces/register.interface';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiService = inject(ApiService);
    private router = inject(Router);

    currentUser = signal<any | null>(null);
    currentPerfil = signal<any | null>(null);

    signIn(datos: LoginInterface) {
        return this.apiService.post('login', datos);
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

        return this.apiService.post('register', formData);
    }

    guardarUsuario(usuario: any) {
        this.currentUser.set(usuario);
        localStorage.setItem('usuario', JSON.stringify(usuario));
    }

    cargarUsuario() {
        const usuarioGuardado = localStorage.getItem('usuario');

        if (usuarioGuardado !== null) {
            this.currentUser.set(JSON.parse(usuarioGuardado));
        }
    }

    cerrarSesion(): void {
        this.currentUser.set(null);
        this.currentPerfil.set(null);

        localStorage.removeItem('usuario');

        this.router.navigate(['/login']);
    }
}
