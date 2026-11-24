import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth-service";



export const authAdminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log('Perfil que recibe el guard:', authService.currentPerfil());

    if (authService.currentPerfil() === 'administrador') {
        return true;
    }

    return router.createUrlTree(['/publicaciones']);
}