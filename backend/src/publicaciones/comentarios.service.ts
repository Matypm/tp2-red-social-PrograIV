import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComentarioMongo } from './schemas/comentarios.schema.js';
import { Model, Types } from 'mongoose';
import { PublicacionMongo } from './schemas/publicacion.schema.js';

@Injectable()
export class ComentariosService {
    constructor(
        @InjectModel(ComentarioMongo.name)
        private readonly comentarios: Model<ComentarioMongo>,
        @InjectModel(PublicacionMongo.name)
        private readonly publicaciones: Model<PublicacionMongo>
    ) { }

    async crearComentario(
        mensaje: string,
        usuarioId: string,
        publicacionId: string
    ) {
        if (!Types.ObjectId.isValid(publicacionId)) {
            throw new BadRequestException('ID de publicación inválido.');
        }

        if (!Types.ObjectId.isValid(usuarioId)) {
            throw new BadRequestException('ID de usuario inválido.');
        }

        if (!mensaje?.trim()) {
            throw new BadRequestException('El comentario no puede estar vacío.');
        }

        const existePublicacion = await this.publicaciones.exists({
            _id: publicacionId,
            eliminada: false
        });

        if (!existePublicacion) {
            throw new NotFoundException('Publicación no encontrada.');
        }

        const comentario = await this.comentarios.create({
            mensaje: mensaje.trim(),
            usuario: new Types.ObjectId(usuarioId),
            publicacion: new Types.ObjectId(publicacionId),
        });

        return comentario;
    }

    async obtenerComentarios(
        publicacionId: string,
        pagina: number = 1,
        limite: number = 5
    ) {
        if (!Types.ObjectId.isValid(publicacionId)) {
            throw new BadRequestException('ID de publicación inválido.');
        }

        if (!Number.isInteger(pagina) || pagina < 1) {
            throw new BadRequestException('Página inválida.');
        }

        if (!Number.isInteger(limite) || limite < 1) {
            throw new BadRequestException('Límite inválido.');
        }

        if (limite > 50) {
            throw new BadRequestException('El límite máximo es de 50 comentarios.');
        }

        const existePublicacion = await this.publicaciones.exists({
            _id: publicacionId,
            eliminada: false
        });

        if (!existePublicacion) {
            throw new NotFoundException('Publicación no encontrada.');
        }

        const comentarios = await this.comentarios.
            find({
                publicacion: new Types.ObjectId(publicacionId)
            })
            .sort({ fecha_creacion: -1 })
            .skip((pagina - 1) * limite)
            .limit(limite)
            .populate('usuario', 'nombre nombre_usuario img_perfil')
            .exec();

        return comentarios;
    }

    async editarComentario(
        comentarioId: string,
        usuarioId: string,
        mensaje: string,
    ) {
        if (!Types.ObjectId.isValid(comentarioId)) {
            throw new BadRequestException('ID de comentario inválido.');
        }

        if (!mensaje?.trim()) {
            throw new BadRequestException('El comentario no puede estar vacío.');
        }

        if (!Types.ObjectId.isValid(usuarioId)) {
            throw new BadRequestException('ID de usuario inválido.');
        }

        const comentario = await this.comentarios.findOneAndUpdate(
            {
                _id: new Types.ObjectId(comentarioId),
                usuario: new Types.ObjectId(usuarioId)
            },
            {
                $set: {
                    mensaje: mensaje.trim(),
                    modificado: true
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!comentario) {
            throw new NotFoundException(
                'Comentario no encontrado o no tenés permiso para editarlo.'
            );
        }

        return comentario;
    }


}
