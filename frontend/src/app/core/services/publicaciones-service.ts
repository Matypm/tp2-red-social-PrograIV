import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { ConsultarPublicacionesInterface } from '../interfaces/consultar-publicaciones.interface';
import { RespuestaPublicacionesInterface } from '../interfaces/rta-publicaciones.interface';

@Injectable({
    providedIn: 'root'
})
export class PublicacionesService {

    private apiService = inject(ApiService);

    listar(datos: ConsultarPublicacionesInterface) {
        return this.apiService.get<RespuestaPublicacionesInterface>
        ('publicaciones', datos);
    }

    darLike(publicacionId: string, usuarioId: string) {
        return this.apiService.post
        (`publicaciones/${publicacionId}/likes`, { usuarioId });
    }

    sacarLike(publicacionId: string, usuarioId: string) {
        return this.apiService.delete
        (`publicaciones/${publicacionId}/likes`, { usuarioId });
    }

    eliminarPublicacion(publicacionId: string, usuarioId: string) {
        return this.apiService.delete
        (`publicaciones/${publicacionId}`, { usuarioId });
    }


}
