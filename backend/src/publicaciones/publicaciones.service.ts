import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PublicacionMongo } from './schemas/publicacion.schema.js';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';

@Injectable()
export class PublicacionesService {
    constructor(
        @InjectModel(PublicacionMongo.name)
        private readonly modelo: Model<PublicacionMongo>,

        private readonly cloudinaryService: CloudinaryService,

        private readonly usuariosService: UsuariosService,
    ) { }

    async crear(datos: CrearPublicacionDto, archivo?: Express.Multer.File) {

        // Compruebo que el usuario exista.
        const usuario = await this.usuariosService.buscarUserPorId(datos.usuarioId,);

        if (!usuario) {
            throw new NotFoundException('El usuario no existe.');
        }

        let imgSubida: { url: string; publicId: string } | undefined;

        try {
            let imagen = '';
            let imagen_public_id = '';

            // Si el usuario adjuntó una imagen, se procesa y sube
            if (archivo) {
                const buffer = await this.cloudinaryService.normalizar(archivo);

                imgSubida = await this.cloudinaryService.subir(
                    buffer,
                    'publicaciones',
                );

                imagen = imgSubida.url;
                imagen_public_id = imgSubida.publicId;
            }

            // Creamos el documento en MongoDB.
            const publicacion = await this.modelo.create({
                usuario: usuario._id,
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                imagen,
                imagen_public_id,
            });

            return publicacion;
        } catch (error) {
            // Si MongoDB falla después de subir la imagen,
            // se elimina la imagen para evitar archivos innecesarios.
            if (imgSubida) {
                await this.cloudinaryService.eliminar(imgSubida.publicId);
            }

            throw error;
        }
    }


}
