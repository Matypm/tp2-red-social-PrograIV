import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../autenticacion/jwt-auth-guard.js';
import { ComentariosService } from './comentarios.service.js';
import { UsuarioActual } from '../common/decorators/usuario-actual.decorator.js';

@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
export class ComentariosController {
    constructor(
        private readonly comentariosService: ComentariosService
    ) { }

    @Post(':publicacionId/comentarios')
    crearComentario(
        @Param('publicacionId') publicacionId: string,
        @Body('mensaje') mensaje: string,
        @UsuarioActual('sub') usuarioId: string
    ) {
        return this.comentariosService.crearComentario(
            mensaje,
            usuarioId,
            publicacionId
        );
    }

    @Get(':publicacionId/comentarios')
    obtenerComentarios(
        @Param('publicacionId') publicacionId: string,
        @Query('pagina') pagina: string = '1',
        @Query('limite') limite: string = '5'
    ) {
        return this.comentariosService.obtenerComentarios(
            publicacionId,
            Number(pagina),
            Number(limite)
        );
    }

    @Put('comentarios/:comentarioId')
    editarComentario(
        @Param('comentarioId') comentarioId: string,
        @Body('mensaje') mensaje: string,
        @UsuarioActual('sub') usuarioId: string
    ) {
        return this.comentariosService.editarComentario(
            comentarioId,
            usuarioId,
            mensaje
        );
    }
}
