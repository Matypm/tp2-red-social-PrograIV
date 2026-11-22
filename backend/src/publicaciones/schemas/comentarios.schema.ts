import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { UsuarioMongo } from "../../usuarios/schemas/usuario.schema.js";
import { PublicacionMongo } from "./publicacion.schema.js";




@Schema({ collection: 'comentarios', versionKey: false })
export class ComentarioMongo {
    @Prop({
        type: Types.ObjectId,
        ref: UsuarioMongo.name,
        required: true
    })
    usuario!: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: PublicacionMongo.name,
        required: true
    })
    publicacion!: Types.ObjectId;

    @Prop({ required: true, trim: true })
    mensaje!: string;

    @Prop({ default: Date.now })
    fecha_creacion!: Date;

    @Prop({ default: false })
    modificado!: boolean;
}

export type ComentarioDocument = HydratedDocument<ComentarioMongo>;

export const ComentarioSchema =
    SchemaFactory.createForClass(ComentarioMongo);