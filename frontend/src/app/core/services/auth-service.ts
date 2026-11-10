import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api-service';
import { LoginInterface } from '../interfaces/login.interface';
import { RegisterInterface } from '../interfaces/register.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiService = inject(ApiService);

    currentUser = signal<any | null>(null);
    currentPerfil = signal<any | null>(null);

    signIn(datos: LoginInterface){
        return this.apiService.post('login', datos);
    }

    signUp(datos: RegisterInterface){
        return this.apiService.post('register', datos);
    }


}
