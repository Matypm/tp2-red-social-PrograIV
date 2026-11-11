import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsuarioMongo } from './schemas/usuario.schema/usuario.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectModel(UsuarioMongo.name) private readonly modelo: Model<UsuarioMongo>,
    ) {}

    async crearUser() {

    }

    async buscarPorIdentificador(identificador: string) {
        return this.modelo.findOne({
            $or: [
                //Buscá un usuario cuyo correo coincida 
                // con el identificador O cuyo nombre de usuario coincida con él.
                {correo: identificador.toLowerCase()},
                {nombre_usuario: identificador.toLowerCase()},
            ],
        // exec ejecuta la consulta y devuelve una Promise con el resultado
        }).exec();
    }

    async buscarUserPorId(id: string) {
        return this.modelo.findById(id).exec();
    }

    async buscarPorCorreoONombreUser(correo: string, nombre_usuario: string){
        return this.modelo.findOne({
            $or: [
                { correo },
                { nombre_usuario }
            ]
        }).exec();
    }

}
