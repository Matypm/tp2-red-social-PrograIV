import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { AutenticacionService } from './autenticacion.service.js'; 

@Controller()
export class AutenticacionController {
    constructor(
        private readonly authService: AutenticacionService,
    ){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() datos: LoginDto){
        return this.authService.login(datos)
    }
}
