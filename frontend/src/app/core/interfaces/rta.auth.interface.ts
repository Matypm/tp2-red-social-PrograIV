export interface RespuestaAuth {
    usuario: {
        _id: string;
        nombre: string;
        apellido: string;
        correo: string;
        nombre_usuario: string;
        perfil: 'usuario' | 'administrador';
        img_perfil?: string;
    };
}