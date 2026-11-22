import { IsIn } from 'class-validator';
import { RegisterDto } from '../../autenticacion/dto/register.dto.js';

export class CrearUsuarioAdminDto extends RegisterDto {
    @IsIn(['usuario', 'administrador'])
    perfil!: 'usuario' | 'administrador';
}