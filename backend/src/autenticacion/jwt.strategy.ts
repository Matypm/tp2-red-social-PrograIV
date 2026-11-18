import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export type Perfil = 'usuario' | 'administrador';

export type UsuarioJwt = {
    sub: string;
    correo: string;
    nombre_usuario: string;
    perfil: Perfil;
};

type RequestConCookies = Request & {
    cookies?: {
        access_token?: string;
    };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request): string | null => {
                    const req = request as RequestConCookies;
                    return req.cookies?.access_token ?? null;
                }
            ]),
            secretOrKey: process.env.JWT_SECRET!,
            ignoreExpiration: false,
            algorithms: ['HS256'],
        });
    }

    validate(payload: UsuarioJwt): UsuarioJwt {
        return {
            sub: payload.sub,
            correo: payload.correo,
            nombre_usuario: payload.nombre_usuario,
            perfil: payload.perfil,
        };
    }
}