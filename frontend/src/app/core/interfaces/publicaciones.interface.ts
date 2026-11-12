export interface PublicacionInterface {
    _id: string;
    usuario: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    likes: string[];
    cantidad_likes: Number;
    fecha_creacion: Date;
    eliminada: boolean;
    autor: {
        _id: string;
        nombre: string;
        apellido: string;
        nombre_usuario: string;
        descripcion: string;
        img_perfil: string;
        perfil: string;
    };
}