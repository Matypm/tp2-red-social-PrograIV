import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export type Perfil = 'usuario' | 'administrador';

export type UsuarioJwt = {
    sub: string;
    correo: string;
    perfil: Perfil;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET!,
            ignoreExpiration: false,
            algorithms: ['HS256'],
        });
    }

    validate(payload: UsuarioJwt): UsuarioJwt {
        return {
            sub: payload.sub,
            correo: payload.correo,
            perfil: payload.perfil,
        };
    }
}