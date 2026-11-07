import { IsString, Matches, MinLength } from "class-validator"

export class LoginDto {

    @IsString()
    @Matches(/\S/)
    identificador!: string

    @IsString()
    @Matches(/\S/)
    contrasenia!: string
}
