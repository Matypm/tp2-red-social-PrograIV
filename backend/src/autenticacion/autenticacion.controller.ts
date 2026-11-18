import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { AutenticacionService } from './autenticacion.service.js';
import { RegisterDto } from './dto/register.dto.js';
import {
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_IMAGEN_BYTES } from '../cloudinary/cloudinary.service.js';
import { JwtAuthGuard } from './jwt-auth-guard.js';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator.js';
import type { Response, CookieOptions } from 'express';

@Controller()
export class AutenticacionController {
    constructor(
        private readonly authService: AutenticacionService,
    ) { }

    private opcionesCookie(): CookieOptions {
        const esProduccion = process.env.NODE_ENV === 'production';

        return {
            httpOnly: true,
            secure: esProduccion,
            sameSite: esProduccion ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000,
            path: '/',
        };
    }

    @Post('register')
    @UseInterceptors(
        FileInterceptor('img_perfil', {
            limits: {
                fileSize: MAX_IMAGEN_BYTES,
            },
        }),
    )
    async registrar(
        @Body() datos: RegisterDto,
        @Res({ passthrough: true }) res: Response,
        @UploadedFile() archivo?: Express.Multer.File
    ) {
        const resultado = await this.authService.register(datos, archivo);

        res.cookie(
            'access_token',
            resultado.access_token,
            this.opcionesCookie()
        );

        return {
            usuario: resultado.usuario
        }
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() datos: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {

        const resultado = await this.authService.login(datos);

        res.cookie(
            'access_token',
            resultado.access_token,
            this.opcionesCookie()
        );

        return {
            usuario: resultado.usuario
        }
    }

    @Post('autorizar')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard) // Comprueba que el token sea válido y no haya expirado.
    // @UsuarioActual('sub') Extrae el ID del usuario autenticado
    autorizar(@UsuarioActual('sub') usuarioId: string) {
        return this.authService.autorizar(usuarioId);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        });

        return {
            mensaje: 'Sesión cerrada correctamente.'
        };
    }

}
