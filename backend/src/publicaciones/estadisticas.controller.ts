import { BadRequestException, Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Roles } from "../autenticacion/common/decorators/roles.decorator.js";
import { JwtAuthGuard } from "../autenticacion/jwt-auth-guard.js";
import { RolesGuard } from "../autenticacion/common/guards/roles.guard.js";
import { EstadisticasService } from "./estadisticas.service.js";



@Controller('publicaciones/estadisticas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
export class EstadisticasController {
    constructor(
        private readonly estadisticasService: EstadisticasService
    ) {}

    @Get('publicaciones-por-usuario')
    publicacionesPorUsuario(
        @Query('fechaDesde') fechaDesde: string,
        @Query('fechaHasta') fechaHasta: string
    ) {
        if (!fechaDesde || !fechaHasta) {
            throw new BadRequestException('Debés indicar una fecha desde y una fecha hasta.');
        }

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(fechaDesde) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fechaHasta)
        ) {
            throw new BadRequestException('Las fechas deben tener el formato YYYY-MM-DD.');
        }

        if (fechaDesde > fechaHasta) {
            throw new BadRequestException('La fecha desde no puede ser posterior a la fecha hasta.');
        }

        return this.estadisticasService.publicacionesPorUsuario(fechaDesde, fechaHasta);
    }

    @Get('cantidad-comentarios')
    cantidadComentarios(
        @Query('fechaDesde') fechaDesde: string,
        @Query('fechaHasta') fechaHasta: string
    ) {
        if (!fechaDesde || !fechaHasta) {
            throw new BadRequestException('Debés indicar una fecha desde y una fecha hasta.');
        }

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(fechaDesde) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fechaHasta)
        ) {
            throw new BadRequestException('Las fechas deben tener el formato YYYY-MM-DD.');
        }

        if (fechaDesde > fechaHasta) {
            throw new BadRequestException('La fecha desde no puede ser posterior a la fecha hasta.');
        }

        return this.estadisticasService.cantidadComentarios(fechaDesde, fechaHasta);
    }

    @Get('comentarios-por-publicacion')
    comentariosPorPublicacion(
        @Query('fechaDesde') fechaDesde: string,
        @Query('fechaHasta') fechaHasta: string
    ) {
        if (!fechaDesde || !fechaHasta) {
            throw new BadRequestException('Debés indicar una fecha desde y una fecha hasta.');
        }

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(fechaDesde) ||
            !/^\d{4}-\d{2}-\d{2}$/.test(fechaHasta)
        ) {
            throw new BadRequestException('Las fechas deben tener el formato YYYY-MM-DD.');
        }

        if (fechaDesde > fechaHasta) {
            throw new BadRequestException('La fecha desde no puede ser posterior a la fecha hasta.');
        }

        return this.estadisticasService.comentariosPorPublicacion(fechaDesde, fechaHasta);
    }
}