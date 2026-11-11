import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
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
}
