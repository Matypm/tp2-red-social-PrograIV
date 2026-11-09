import { Transform } from "class-transformer"
import { IsDateString, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator"


export class RegisterDto{
    @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
    )
    @IsString()
    @Matches(/\S/)
    nombre!: string

    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value
    )
    @IsString()
    @Matches(/\S/)    
    apellido!: string

    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value
    )
    @IsEmail()
    correo!: string

    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : value
    )
    @IsString()
    @Matches(/\S/)
    nombre_usuario!: string


    @IsString()
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/)
    @MinLength(8)
    contrasenia!: string

    @IsString()
    @Matches(/\S/)
    repetir_contrasenia!: string

    @IsDateString({ strict: true })
    fecha_nacimiento!: string

    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value
    )
    @IsOptional()
    @IsString()
    @MaxLength(250)
    descripcion!: string

}