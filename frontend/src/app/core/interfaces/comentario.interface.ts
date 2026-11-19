export interface ComentarioInterface {
    _id: string;
    usuario: {
        _id: string;
        nombre: string;
        nombre_usuario: string;
        img_perfil: string;
    };
    publicacion: string;
    mensaje: string;
    fecha_creacion: Date;
    modificado: boolean;
}