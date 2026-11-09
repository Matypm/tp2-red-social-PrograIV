import { Module } from '@nestjs/common';
import { AutenticacionController } from './autenticacion.controller.js';
import { AutenticacionService } from './autenticacion.service.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioMongo, UsuarioSchema } from '../usuarios/schemas/usuario.schema/usuario.schema.js';

@Module({
  imports: [
        UsuariosModule,
        MongooseModule.forFeature([
            { name: UsuarioMongo.name, schema: UsuarioSchema }
        ]),
    ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService]
})
export class AutenticacionModule {}
