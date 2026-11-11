import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones.controller.js';
import { PublicacionesService } from './publicaciones.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionMongo, PublicacionSchema } from './schemas/publicacion.schema.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PublicacionMongo.name,
        schema: PublicacionSchema
      }
    ]),
    CloudinaryModule,
    UsuariosModule,
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  exports: [PublicacionesService]
})
export class PublicacionesModule { }
