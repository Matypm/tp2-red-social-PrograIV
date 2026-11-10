import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { UsuarioMongo } from '../usuarios/schemas/usuario.schema/usuario.schema.js';
import { Model, mongo } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Injectable()
export class AutenticacionService {
    constructor(
        @InjectModel(UsuarioMongo.name) private readonly usuarios: Model<UsuarioMongo>,
        private readonly usuarioService: UsuariosService,
        private readonly cloudinaryService: CloudinaryService,
    ){}

    async login(datos: LoginDto){
        // Buscamos al usuario
        const usuario = await this.usuarioService.buscarPorIdentificador(datos.identificador)
 
        // Verifica q existe
        if(!usuario){
            throw new UnauthorizedException('Credenciales incorrectas!');
        }

        // Compara contraseñas
        const coincidePassword = await bcrypt.compare(datos.contrasenia, usuario.contrasenia);

        // Verifica q exista
        if (!coincidePassword) {
            throw new UnauthorizedException('Credenciales incorrectas!');
        }

        // Destructuring de la contraseña y los demas datos publicos del user
        // para retornar los datos sin la contraseña
        const { contrasenia, ...userSinContrasenia } = usuario.toObject(); 

        return userSinContrasenia;
    }

    async register(datos: RegisterDto, archivo?: Express.Multer.File){
        if(datos.contrasenia !== datos.repetir_contrasenia){
            throw new BadRequestException('Las contraseñas no coinciden.')
        }

        const userExistente = await this.usuarioService.buscarPorCorreoONombreUser(
            datos.correo,
            datos.nombre_usuario
        );

        if(userExistente){
            throw new ConflictException('El correo o nombre de usuario ya esta registrado. Intente con otros');
        }

        let imgSubida: { url: string, publicId: string } | undefined;

        try{
            let img_perfil = '';
            let img_perfil_public_id = '';

            if(archivo){
                const buffer = await this.cloudinaryService.normalizar(archivo);

                imgSubida = await this.cloudinaryService.subir(buffer);

                img_perfil = imgSubida.url;
                img_perfil_public_id = imgSubida.publicId;
            }

            const usuario = await this.usuarios.create({
                nombre: datos.nombre,
                apellido: datos.apellido,
                correo: datos.correo,
                nombre_usuario: datos.nombre_usuario,
                contrasenia: await bcrypt.hash(datos.contrasenia, 10),
                fecha_nacimiento: datos.fecha_nacimiento,
                descripcion: datos.descripcion,
                img_perfil, // URL para mostrar la foto de perfil.
                img_perfil_public_id, // Identificador para poder eliminarla de Cloudinary.
            });

            const {contrasenia, ...userSinContrasenia} = usuario.toObject();

            return userSinContrasenia;

        } catch(error){

            if(imgSubida) {
                await this.cloudinaryService.eliminar(imgSubida.publicId);
            }

            if(error instanceof mongo.MongoServerError && error.code === 11000){
                throw new ConflictException('El email ya esta registrado.')
            }
            throw error;
        }
    }
}
