import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AutenticacionService {
    constructor(
        private readonly usuarioService: UsuariosService,
        private readonly jwtService: JwtService,
    ) { }

    

    async login(datos: LoginDto) {
        // Buscamos al usuario
        const usuario = await this.usuarioService.buscarPorIdentificador(datos.identificador)

        // Verifica q existe
        if (!usuario) {
            throw new UnauthorizedException('Credenciales incorrectas!');
        }

        // Compara contraseñas
        const coincidePassword = await bcrypt.compare(datos.contrasenia, usuario.contrasenia);

        // Verifica q exista
        if (!coincidePassword) {
            throw new UnauthorizedException('Credenciales incorrectas!');
        }

        if (!usuario.habilitado) {
            throw new ForbiddenException('Tu cuenta se encuentra deshabilitada. Contactá con un administrador');
        }

        // .Destructuring de la contraseña y los demas datos publicos del user
        // para retornar los datos sin la contraseña
        const { contrasenia, ...userSinContrasenia } = usuario.toObject();

        // Genera el token JWT
        const datosToken = await this.generarToken(
            usuario.id,
            usuario.correo,
            usuario.nombre_usuario,
            usuario.perfil
        );

        return {
            usuario: userSinContrasenia,
            ...datosToken,
        };
    }

    async register(datos: RegisterDto, archivo?: Express.Multer.File) {
        if (datos.contrasenia !== datos.repetir_contrasenia) {
            throw new BadRequestException('Las contraseñas no coinciden.')
        }

        const usuario = await this.usuarioService.crearUser(
            datos,
            archivo,
            'usuario'
        );

        const { contrasenia, ...userSinContrasenia } = usuario.toObject();

        const datosToken = await this.generarToken(
            usuario.id,
            usuario.correo,
            usuario.nombre_usuario,
            usuario.perfil
        );

        return {
            usuario: userSinContrasenia,
            ...datosToken
        }
    }

    private async generarToken(id: string, correo: string, nombre_usuario: string, perfil: string) {
        return {
            access_token: await this.jwtService.signAsync({
                sub: id,
                correo,
                nombre_usuario,
                perfil,
            }),
            token_type: 'Bearer',
            expires_in: 180,
        };
    }

    async autorizar(id: string) {
        const usuario = await this.usuarioService.buscarUserPorId(id);

        if (!usuario) {
            throw new UnauthorizedException('Usuario no encontrado!');
        }

        if (!usuario.habilitado) {
            throw new ForbiddenException('Tu cuenta se encuentra deshabilitada.');
        }

        const { contrasenia, ...userSinContrasenia } = usuario.toObject();

        return userSinContrasenia;
    }

    async refrescarToken(token: string) {
        try {
            // Verifica la firma y que el token no haya expirado.
            const payload = await this.jwtService.verifyAsync(token);

            // obtiene el id del usuario para acceder a los campos y ver si esta habilitado o no
            const usuario = await this.usuarioService.buscarUserPorId(
                payload.sub
            );

            if (!usuario || !usuario.habilitado) {
                throw new ForbiddenException('Tu cuenta se encuentra deshabilitada o no existe.');
            }

            // Genera nuevo token
            return this.generarToken(
                payload.id,
                payload.correo,
                payload.nombre_usuario,
                payload.perfil
            );
        } catch (error) {
            throw new UnauthorizedException('Token expirado o inválido');
        }
    }
}
