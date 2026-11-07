import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AutenticacionService {
    constructor(
        private readonly usuarioService: UsuariosService
    ){}

    async login(datos: LoginDto){
        // Buscamos al usuario
        const usuario = await this.usuarioService.buscarPorIdentificador(datos.identificador)
 
        // Verifica q existe
        if(!usuario){
            throw new UnauthorizedException('Credenciales incorrectas!');
        }

        // Compara contraseñas
        const coincidePassword = await bcrypt.compare(datos.contrasenia, usuario.contrasenia);

        // Verifica q exista
        if (!coincidePassword) {
            throw new UnauthorizedException('Credenciales incorrectas!');
        }

        // Destructuring de la contraseña y los demas datos publicos del user
        // para retornar los datos sin la contraseña
        const { contrasenia, ...userSinContrasenia } = usuario.toObject(); 

        return userSinContrasenia;
    }
}
