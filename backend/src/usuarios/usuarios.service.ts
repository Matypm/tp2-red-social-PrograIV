import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsuarioMongo } from './schemas/usuario.schema.js';
import { Model, mongo } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import * as bcrypt from 'bcrypt';

type DatosCrearUsuario = {
    nombre: string;
    apellido: string;
    correo: string;
    nombre_usuario: string;
    contrasenia: string;
    fecha_nacimiento: string;
    descripcion?: string;
}

@Injectable()
export class UsuariosService {
    constructor(
        @InjectModel(UsuarioMongo.name) private readonly modelo: Model<UsuarioMongo>,
        private readonly cloudinaryService : CloudinaryService
    ) {}

    
    async buscarPorIdentificador(identificador: string) {
        return this.modelo.findOne({
            $or: [
                //Buscá un usuario cuyo correo coincida 
                // con el identificador O cuyo nombre de usuario coincida con él.
                {correo: identificador.toLowerCase()},
                {nombre_usuario: identificador.toLowerCase()},
            ],
            // exec ejecuta la consulta y devuelve una Promise con el resultado
        }).exec();
    }
    
    async buscarUserPorId(id: string) {
        return this.modelo.findById(id).exec();
    }
    
    async buscarPorCorreoONombreUser(correo: string, nombre_usuario: string){
        return this.modelo.findOne({
            $or: [
                { correo: correo.toLowerCase() },
                { nombre_usuario: nombre_usuario.toLowerCase() }
            ]
        }).exec();
    }

    async listarUsuarios() {
        return this.modelo
            .find()
            .select('-contrasenia')
            .exec();
    }
        
    async crearUser(
        datos: DatosCrearUsuario,
        archivo?: Express.Multer.File,
        perfil: 'usuario' | 'administrador' = 'usuario'
    ) {
        const correo = datos.correo.toLowerCase();
        const nombre_usuario = datos.nombre_usuario.toLowerCase();      

        const userExistente = await this.buscarPorCorreoONombreUser(
            correo,
            nombre_usuario,
        );

        if (userExistente) {
            throw new ConflictException(
                'El correo o nombre de usuario ya está registrado.',
            );
        }

        let imgSubida: { url: string; publicId: string } | undefined;

        try {
            let img_perfil = '';
            let img_perfil_public_id = '';

            if (archivo) {
                const buffer = await this.cloudinaryService.normalizar(archivo);
                imgSubida = await this.cloudinaryService.subir(buffer);

                img_perfil = imgSubida.url;
                img_perfil_public_id = imgSubida.publicId;
            }

            const usuario = await this.modelo.create({
                nombre: datos.nombre,
                apellido: datos.apellido,
                correo,
                nombre_usuario,
                contrasenia: await bcrypt.hash(datos.contrasenia, 10),
                fecha_nacimiento: datos.fecha_nacimiento,
                descripcion: datos.descripcion ?? '',
                img_perfil,
                img_perfil_public_id,
                perfil,
                habilitado: true
            });

            return usuario;

        } catch (error) {
            if (imgSubida) {
                await this.cloudinaryService.eliminar(imgSubida.publicId);
            }

            if (
                error instanceof mongo.MongoServerError &&
                error.code === 11000
            ) {
                throw new ConflictException(
                    'El correo o nombre de usuario ya está registrado.',
                );
            }

            throw error;
        }
    }
}
