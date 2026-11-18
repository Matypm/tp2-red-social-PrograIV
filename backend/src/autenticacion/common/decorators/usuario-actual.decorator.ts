import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { UsuarioJwt } from '../../jwt.strategy.js';

export const UsuarioActual = createParamDecorator(
    (campo: keyof UsuarioJwt | undefined, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest<
            Request & { user: UsuarioJwt }
        >();

        return campo ? req.user[campo] : req.user;
    },
);