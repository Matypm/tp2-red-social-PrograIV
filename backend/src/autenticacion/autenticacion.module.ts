import { Module } from '@nestjs/common';
import { AutenticacionController } from './autenticacion.controller.js';
import { AutenticacionService } from './autenticacion.service.js';

@Module({
  controllers: [AutenticacionController],
  providers: [AutenticacionService]
})
export class AutenticacionModule {}
