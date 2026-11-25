import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones.controller.js';
import { PublicacionesService } from './publicaciones.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicacionMongo, PublicacionSchema } from './schemas/publicacion.schema.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { ComentarioMongo, ComentarioSchema } from './schemas/comentarios.schema.js';
import { ComentariosService } from './comentarios.service.js';
import { ComentariosController } from './comentarios.controller.js';
import { EstadisticasService } from './estadisticas.service.js';
import { EstadisticasController } from './estadisticas.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PublicacionMongo.name,
        schema: PublicacionSchema
      },
      {
        name: ComentarioMongo.name,
        schema: ComentarioSchema
      }
    ]),
    CloudinaryModule,
    UsuariosModule,
  ],
  controllers: [PublicacionesController, ComentariosController, EstadisticasController],
  providers: [PublicacionesService, ComentariosService, EstadisticasService],
  exports: [PublicacionesService]
})
export class PublicacionesModule { }
