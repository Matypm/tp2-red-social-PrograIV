import { Routes } from '@angular/router';
import { authAdminGuard } from './core/guards/auth.admin.guard';

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
        path: 'perfil',
        loadComponent: () => import('./features/mi-perfil/mi-perfil-component').then(c => c.MiPerfilComponent)
    },
    {
        path: 'publicaciones',
        loadComponent: () => import('./features/publicaciones/publicaciones-component').then(c => c.PublicacionesComponent)
    },
    {
        path: 'publicaciones/crear',
        loadComponent: () => import('./features/publicaciones/crear-publicacion')
            .then(c => c.CrearPublicacion)
    },
    {
        path: 'publicaciones/:id',
        loadComponent: () => import('./features/publicaciones/detalle-publicacion-component/detalle-publicacion').then(c => c.DetallePublicacion)
    },
    {
        path: 'dashboard/usuarios',
        canActivate: [authAdminGuard],
        loadComponent: () => import('./features/dashboard/usuarios/usuarios-admin-component').then(c => c.UsuariosAdminComponent)
    },
    {
        path: 'dashboard/estadisticas',
        canActivate: [authAdminGuard],
        loadComponent: () => import('./features/dashboard/estadisticas/estadisticas-admin-component').then(c => c.EstadisticasAdminComponent)
    },
];
