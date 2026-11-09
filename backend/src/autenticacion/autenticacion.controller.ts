import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { AutenticacionService } from './autenticacion.service.js'; 
import { RegisterDto } from './dto/register.dto.js';

@Controller()
export class AutenticacionController {
    constructor(
        private readonly authService: AutenticacionService,
    ){}

    @Post('register')
    registrar(@Body() datos: RegisterDto){
        return this.authService.register(datos);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() datos: LoginDto){
        return this.authService.login(datos)
    }

    
}
