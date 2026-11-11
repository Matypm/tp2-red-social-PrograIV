import { Type } from 'class-transformer';
import {
    IsIn,
    IsInt,
    IsMongoId,
    IsOptional,
    Max,
    Min,
} from 'class-validator';

export class ConsultarPublicacionesDto {
    @IsOptional()
    @IsIn(['fecha', 'likes'])
    orden: string = 'fecha';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset: number = 0;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 10;

    @IsOptional()
    @IsMongoId()
    usuarioId?: string;
}