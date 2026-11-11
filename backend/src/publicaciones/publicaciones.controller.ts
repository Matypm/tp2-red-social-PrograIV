import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';

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
}
