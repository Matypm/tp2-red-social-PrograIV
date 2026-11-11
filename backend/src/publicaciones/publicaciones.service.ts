import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PublicacionMongo } from './schemas/publicacion.schema.js';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';
import { ConsultarPublicacionesDto } from './dto/consultar-publicaciones.dto.js';

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

    async listar(datos: ConsultarPublicacionesDto) {
        const orden = datos.orden ?? 'fecha';
        const offset = datos.offset ?? 0;
        const limit = datos.limit ?? 10;

        const filtro: any = { eliminada: false, };

        if (datos.usuarioId) {
            filtro.usuario = new Types.ObjectId(datos.usuarioId);
        }

        const publicaciones = await this.modelo.aggregate([
            { $match: filtro },
            {
                $addFields: {
                    cantidad_likes: { $size: '$likes' },
                },
            },
            {
                $sort:
                    orden === 'likes'
                        ? { cantidad_likes: -1 }
                        : { fecha_creacion: -1 },
            },
            { $skip: offset },
            { $limit: limit },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuario',
                    foreignField: '_id',
                    as: 'autor',
                },
            },
            { $unwind: '$autor' },
            {
                $project: {
                    'autor.contrasenia': 0,
                    'autor.correo': 0,
                    'autor.fecha_nacimiento': 0,
                    'autor.img_perfil_public_id': 0,
                },
            },
        ]);

        const total = await this.modelo.countDocuments(filtro);

        return {
            publicaciones,
            total,
            offset,
            limit,
        };
    }

    async darLike(publicacionId: string, usuarioId: string) {
        // Valido q el ID de la publicacion sea correcto
        if (!Types.ObjectId.isValid(publicacionId)) {
            throw new BadRequestException('ID de publicación inválido.')
        }

        // Verificar q existe el usuario
        const usuario = await this.usuariosService.buscarUserPorId(usuarioId);

        if (!usuario) {
            throw new NotFoundException('El usuario no existe.');
        }

        // Busca la publi y se le agrega el like
        const publicacion = await this.modelo.findOneAndUpdate(
            { _id: publicacionId, eliminada: false },
            {
                $addToSet: { likes: usuario._id }
            },
            { new: true },
        );

        if (!publicacion) {
            throw new NotFoundException('La publicación no existe.');
        }

        return publicacion;
    }

    async sacarLike(publicacionId: string, usuarioId: string) {
        // Valida que exista o sea correcta la publi
        if (!Types.ObjectId.isValid(publicacionId)) {
            throw new BadRequestException('ID de publicación inválido.');
        }

        // Validar q exista el usuario
        const usuario = await this.usuariosService.buscarUserPorId(usuarioId);

        if (!usuario) {
            throw new NotFoundException('El usuario no existe.');
        }

        // Busca la publicacion y le saca el like
        const publicacion = await this.modelo.findOneAndUpdate(
            {
                _id: publicacionId,
                eliminada: false,
                likes: usuario._id,
            },
            {
                $pull: {
                    likes: usuario._id,
                },
            },
            {
                new: true,
            },
        );

        if (!publicacion) {
            throw new NotFoundException('La publicación no existe o el usuario no le dio like');
        }

        return publicacion;
    }

    async eliminarPublicacion(publicacionId: string, usuarioId: string) {
        // Validar los IDs
        if (
            !Types.ObjectId.isValid(publicacionId) ||
            !Types.ObjectId.isValid(usuarioId)) {
            throw new BadRequestException('ID inválido');
        }

        // Busca al usuario que solicita la eliminación
        const usuario = await this.usuariosService.buscarUserPorId(usuarioId);

        if (!usuario) {
            throw new NotFoundException('El usuario no existe.');
        }

        // Busca la publicacion
        const publicacion = await this.modelo.findOne({
            _id: publicacionId,
            eliminada: false
        });

        if (!publicacion) {
            throw new NotFoundException('La publicación no existe');
        }

        // Comprueba si es el q creo la publicacion o el admin
        const esCreador = publicacion.usuario.toString() === usuarioId;
        const esAdmin = usuario.perfil === 'administrador';

        if (!esCreador && !esAdmin) {
            throw new ForbiddenException('No tenes permiso para eliminar esta publicación!');
        }

        // Baja lógica
        publicacion.eliminada = true;

        return publicacion.save();
    }

    
}
