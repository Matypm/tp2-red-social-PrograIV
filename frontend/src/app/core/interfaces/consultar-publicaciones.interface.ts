export interface ConsultarPublicacionesInterface {
    orden?: 'fecha' | 'likes';
    offset?: number;
    limit?: number;
    usuarioId?: string;
}