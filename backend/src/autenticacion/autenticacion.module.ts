import { Module } from '@nestjs/common';
import { AutenticacionController } from './autenticacion.controller.js';
import { AutenticacionService } from './autenticacion.service.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';

@Module({
  imports: [UsuariosModule],
  controllers: [AutenticacionController],
  providers: [AutenticacionService]
})
export class AutenticacionModule {}
