import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { PublicacionesModule } from './publicaciones/publicaciones.module.js';
import { AutenticacionModule } from './autenticacion/autenticacion.module.js';
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URI!,
    ),

    UsuariosModule,
    AutenticacionModule,
    PublicacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
