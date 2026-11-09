import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { UsuarioMongo } from '../usuarios/schemas/usuario.schema/usuario.schema.js';
import { Model, mongo } from 'mongoose';

@Injectable()
export class AutenticacionService {
    constructor(
        @InjectModel(UsuarioMongo.name) private readonly usuarios: Model<UsuarioMongo>,
        private readonly usuarioService: UsuariosService
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

    async register(datos: RegisterDto){
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

        try{
            const usuario = await this.usuarios.create({
                nombre: datos.nombre,
                apellido: datos.apellido,
                correo: datos.correo,
                nombre_usuario: datos.nombre_usuario,
                contrasenia: await bcrypt.hash(datos.contrasenia, 10),
                fecha_nacimiento: datos.fecha_nacimiento,
                descripcion: datos.descripcion
            });

            const {contrasenia, ...userSinContrasenia} = usuario.toObject();

            return userSinContrasenia;

        } catch(error){
            if(error instanceof mongo.MongoServerError && error.code === 11000){
                throw new ConflictException('El email ya esta registrado.')
            }
            throw error;
        }
    }
}
