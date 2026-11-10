import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

@Schema({ collection: 'usuarios', versionKey: false })
export class UsuarioMongo {
    @Prop({ required: true, trim: true })
    nombre!: string;

    @Prop({ required: true, trim: true })
    apellido!: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    correo!: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    nombre_usuario!: string

    @Prop({ required: true })
    contrasenia!: string

    @Prop({ required: true })
    fecha_nacimiento!: string

    @Prop({ default: '' })
    descripcion!: string

    @Prop({ default: '' })
    img_perfil!: string

    @Prop({ default: '' })
    img_perfil_public_id!: string;

    @Prop({ default: 'usuario', enum: ['usuario', 'administrador'] })
    perfil!: string
}

export type UsuarioDocument = HydratedDocument<UsuarioMongo>;
export const UsuarioSchema = SchemaFactory.createForClass(UsuarioMongo);
