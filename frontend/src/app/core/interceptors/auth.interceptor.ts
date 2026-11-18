import { HttpErrorResponse, HttpInterceptor, HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../../../environments/environments";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth-service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";



export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const apiUrl = environment.apiUrl;

    // Solo intercepta las peticiones dirigidas al backend
    if (!req.url.startsWith(`${apiUrl}/`)) {
        return next(req);
    }

    const auth = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: unknown) => {

            if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                req.url !== `${apiUrl}/login` &&
                req.url !== `${apiUrl}/register`
            ) {
                auth.limpiarSesion();
                void router.navigate(['/login']);
            }

            return throwError(() => error);
        })
    );
}