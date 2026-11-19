import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api-service";
import { ComentarioInterface } from "../interfaces/comentario.interface";


@Injectable({
    providedIn: 'root'
})
export class ComentariosService {

    private apiService = inject(ApiService);

    crearComentario(publicacionId: string, mensaje: string) {
        return this.apiService.post<ComentarioInterface>(
            `publicaciones/${publicacionId}/comentarios`,
            { mensaje }
        );
    }

    obtenerComentarios(
        publicacionId: string,
        pagina: number = 1,
        limite: number = 5
    ) {
        return this.apiService.get<ComentarioInterface[]>(
            `publicaciones/${publicacionId}/comentarios`,
            { pagina, limite }
        );
    }

    editarComentario(comentarioId: string, mensaje: string) {
        return this.apiService.put<ComentarioInterface>(
            `publicaciones/comentarios/${comentarioId}`,
            { mensaje }
        );
    }
}