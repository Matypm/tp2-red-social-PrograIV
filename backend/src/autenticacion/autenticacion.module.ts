import { Module } from '@nestjs/common';
import { AutenticacionController } from './autenticacion.controller.js';
import { AutenticacionService } from './autenticacion.service.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioMongo, UsuarioSchema } from '../usuarios/schemas/usuario.schema/usuario.schema.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy.js';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsuariosModule,
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: UsuarioMongo.name, schema: UsuarioSchema }
    ]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3m' },
      }),
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, JwtStrategy]
})
export class AutenticacionModule { }
