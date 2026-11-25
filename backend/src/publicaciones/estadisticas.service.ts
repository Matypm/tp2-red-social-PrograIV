import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PublicacionMongo } from "./schemas/publicacion.schema.js";
import { Model } from "mongoose";
import { ComentarioMongo } from "./schemas/comentarios.schema.js";

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(PublicacionMongo.name)
    private readonly modeloPublicaciones: Model<PublicacionMongo>,

    @InjectModel(ComentarioMongo.name)
    private readonly modeloComentarios: Model<ComentarioMongo>,
  ) {}

    async publicacionesPorUsuario(fechaDesde: string, fechaHasta: string) {
        const desde = new Date(`${fechaDesde}T00:00:00.000Z`);
        const hasta = new Date(`${fechaHasta}T00:00:00.000Z`);

        // Incluye todo el día seleccionado como fechaHasta
        hasta.setUTCDate(hasta.getUTCDate() + 1);

        return this.modeloPublicaciones.aggregate([
            {
                $match: {
                    fecha_creacion: {
                        $gte: desde,
                        $lt: hasta
                    },
                    eliminada: false
                }
            },
            {
                $group: {
                    _id: '$usuario',
                    cantidad: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'usuario'
                }
            },
            {
                $unwind: '$usuario'
            },
            {
                $project: {
                    _id: 0,
                    nombre_usuario: '$usuario.nombre_usuario',
                    cantidad: 1
                }
            },
            {
                $sort: {
                    cantidad: -1
                }
            }
        ]);
    }

    async cantidadComentarios(fechaDesde: string, fechaHasta: string) {
        const desde = new Date(`${fechaDesde}T00:00:00.000Z`);
        const hasta = new Date(`${fechaHasta}T00:00:00.000Z`);

        hasta.setUTCDate(hasta.getUTCDate() + 1);

        return this.modeloComentarios.aggregate([
            {
                $match: {
                    fecha_creacion: {
                        $gte: desde,
                        $lt: hasta
                    }
                }
            },
            {
                $lookup: {
                    from: 'publicaciones',
                    localField: 'publicacion',
                    foreignField: '_id',
                    as: 'publicacion'
                }
            },
            {
                $unwind: '$publicacion'
            },
            {
                $match: {
                    'publicacion.eliminada': false
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$fecha_creacion',
                            timezone: 'UTC'
                        }
                    },
                    cantidad: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    fecha: '$_id',
                    cantidad: 1
                }
            },
            {
                $sort: {
                    fecha: 1
                }
            }
        ]);
    }

    async comentariosPorPublicacion(fechaDesde: string, fechaHasta: string) {
        const desde = new Date(`${fechaDesde}T00:00:00.000Z`);
        const hasta = new Date(`${fechaHasta}T00:00:00.000Z`);

        hasta.setUTCDate(hasta.getUTCDate() + 1);

        return this.modeloComentarios.aggregate([
            {
                $match: {
                    fecha_creacion: {
                        $gte: desde,
                        $lt: hasta
                    }
                }
            },
            {
                $group: {
                    _id: '$publicacion',
                    cantidad: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'publicaciones',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'publicacion'
                }
            },
            {
                $unwind: '$publicacion'
            },
            {
                $match: {
                    'publicacion.eliminada': false
                }
            },
            {
                $project: {
                    _id: 0,
                    publicacionId: '$publicacion._id',
                    titulo: '$publicacion.titulo',
                    cantidad: 1
                }
            },
            {
                $sort: {
                    cantidad: -1
                }
            }
        ]);
    }
}