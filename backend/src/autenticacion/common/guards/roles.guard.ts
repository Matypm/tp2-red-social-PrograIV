import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { Perfil } from '../../jwt.strategy.js'; 
import { ROLES_KEY } from '../decorators/roles.decorator.js'; 
import type { UsuarioJwt } from '../../jwt.strategy.js'; 

// Guard: deja pasar solo si el rol del usuario está entre los permitidos
// por @Roles(). Debe ir DESPUÉS de JwtAuthGuard, que es quien carga req.user.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    // Busca @Roles() primero en el método y, si no hay, en el controlador.
    const perfilesPermitidos = this.reflector.getAllAndOverride<Perfil[] | undefined>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    // Sin @Roles() la ruta solo exige estar autenticado.
    if (!perfilesPermitidos || perfilesPermitidos.length === 0) return true;

    const { user } = ctx
      .switchToHttp()
      .getRequest<Request & { user?: UsuarioJwt }>();
    if (!user || !perfilesPermitidos.includes(user.perfil)) {
      throw new ForbiddenException('No tenés permisos para esta acción');
    }
    return true;
  }
}