import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';
import { ConsultarPublicacionesDto } from './dto/consultar-publicaciones.dto.js';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(
        private readonly publicacionesService: PublicacionesService,
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('imagen', {
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    crear(
        @Body() datos: CrearPublicacionDto, 
        @UploadedFile() archivo?: Express.Multer.File
    ){
        return this.publicacionesService.crear(datos, archivo);
    }

    @Get()
    listar(@Query() datos: ConsultarPublicacionesDto){
        return this.publicacionesService.listar(datos);
    }

    @Post(':id/likes')
    darLike(
        @Param('id') publicacionId: string,
        @Body('usuarioId') usuarioId: string
    ) {
        return this.publicacionesService.darLike(publicacionId, usuarioId);
    }

    @Delete(':id/likes') // :id representa el ID de la publicación
    sacarLike(
        @Param('id') publicacionId : string, // @Param('id') obtiene ese ID de la URL.
        @Body('usuarioId') usuarioId : string // @Body('usuarioId') obtiene el usuario desde el cuerpo de la petición.
    ) {
        return this.publicacionesService.sacarLike(publicacionId, usuarioId);
    }

    @Delete(':id')
    eliminarPublicacion(
        @Param('id') publicacionId : string,
        @Body('usuarioId') usuarioId : string
    ) {
        return this.publicacionesService.eliminarPublicacion(publicacionId, usuarioId);
    }
}
