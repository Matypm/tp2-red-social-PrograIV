export interface RegisterInterface {
    nombre: string,
    apellido: string,
    correo: string,
    nombre_usuario: string,
    contrasenia: string,
    repetir_contrasenia: string,
    fecha_nacimiento: string,
    descripcion: string,
    img_perfil: File | null
}