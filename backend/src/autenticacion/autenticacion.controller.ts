import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { AutenticacionService } from './autenticacion.service.js'; 
import { RegisterDto } from './dto/register.dto.js';
import {
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_IMAGEN_BYTES } from '../cloudinary/cloudinary.service.js';

@Controller()
export class AutenticacionController {
    constructor(
        private readonly authService: AutenticacionService,
    ){}

    @Post('register')
    @UseInterceptors(
        FileInterceptor('img_perfil', {
            limits: {
                fileSize: MAX_IMAGEN_BYTES,
            },
        }),
    )
    registrar(
        @Body() datos: RegisterDto, 
        @UploadedFile() archivo?: Express.Multer.File
    ){
        return this.authService.register(datos, archivo);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() datos: LoginDto){
        return this.authService.login(datos)
    }

    
}
