import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller.js';
import { UsuariosService } from './usuarios.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioMongo, UsuarioSchema } from './schemas/usuario.schema/usuario.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UsuarioMongo.name, schema: UsuarioSchema }])
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule {}
