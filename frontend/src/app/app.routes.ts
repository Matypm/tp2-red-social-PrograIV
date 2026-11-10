import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo: '/login', pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login-component').then(c => c.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register-component').then(c => c.RegisterComponent)
    },
    {
        path: 'publicaciones',
        loadComponent: () => import('./features/publicaciones/publicaciones-component').then(c => c.PublicacionesComponent)
    },
    {
        path: 'perfil',
        loadComponent: () => import('./features/mi-perfil/mi-perfil-component').then(c => c.MiPerfilComponent)
    }
];
