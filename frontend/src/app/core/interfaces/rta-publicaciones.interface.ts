import { PublicacionInterface } from "./publicaciones.interface";

export interface RespuestaPublicacionesInterface {
    publicaciones: PublicacionInterface[];
    total: number;
    offset: number;
    limit: number;
}