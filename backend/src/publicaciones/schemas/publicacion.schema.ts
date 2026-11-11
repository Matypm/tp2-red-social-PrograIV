import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, type HydratedDocument } from 'mongoose';
import { UsuarioMongo } from '../../usuarios/schemas/usuario.schema/usuario.schema.js';

@Schema({ collection: 'publicaciones', versionKey: false })
export class PublicacionMongo {
    @Prop({
        type: Types.ObjectId,
        // indica que el identificador de usuario corresponde a un documento de la colección de usuarios.
        ref: UsuarioMongo.name,
        required: true
    })
    usuario!: Types.ObjectId;

    @Prop({ required: true, trim: true })
    titulo!: string;

    @Prop({ required: true, trim: true })
    descripcion!: string;

    @Prop({ default: '' })
    imagen!: string;

    @Prop({ default: '' })
    imagen_public_id!: string;

    @Prop({
        type: [{ type: Types.ObjectId, ref: UsuarioMongo.name }],
        default: []
    })
    likes!: Types.ObjectId[];

    @Prop({ default: Date.now })
    fecha_creacion!: Date;

    @Prop({ default: false })
    eliminada!: boolean;
}

export type PublicacionDocument = HydratedDocument<PublicacionMongo>;

export const PublicacionSchema =
    SchemaFactory.createForClass(PublicacionMongo);
