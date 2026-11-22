import { BadRequestException, Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../autenticacion/jwt-auth-guard.js';
import { RolesGuard } from '../autenticacion/common/guards/roles.guard.js';
import { UsuariosService } from './usuarios.service.js';
import { CrearUsuarioAdminDto } from './dto/crear.usuario.admin.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../autenticacion/common/decorators/roles.decorator.js';

@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('administrador')
    @UseInterceptors(FileInterceptor('archivo'))
    async crearUsuario (
        @Body() datos: CrearUsuarioAdminDto,
        @UploadedFile() archivo? : Express.Multer.File
    ) {
        const { repetir_contrasenia, perfil, ...datosUsuario } = datos;

        if (datos.contrasenia !== repetir_contrasenia) {
            throw new BadRequestException('Las contraseñas no coinciden.');
        }

        const usuario = await this.usuariosService.crearUser(
            datosUsuario,
            archivo,
            perfil,
        );

        const { contrasenia, ...usuarioSinContrasenia } = usuario.toObject();

        return usuarioSinContrasenia;
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('administrador')
    async listarUsuarios() {
        return this.usuariosService.listarUsuarios()
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('administrador')
    async darDeBajaUser(@Param('id') usuarioId: string) {
        return this.usuariosService.darDeBajaUser(usuarioId);
    }  
    
    @Post(':id/habilitar')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('administrador')
    async darDeAltaUser(@Param('id') usuarioId: string) {
        return this.usuariosService.darDeAltaUser(usuarioId);
    }
}
