import { SetMetadata } from '@nestjs/common';
import { Perfil } from '../../jwt.strategy.js';

export const ROLES_KEY = 'roles';

// Decorador que guarda como metadata qué roles pueden usar la ruta.
// No bloquea nada por sí solo: RolesGuard es quien lee esta metadata.
//   @Roles('admin')
//   @Roles('admin', 'user')

export const Roles = (...perfiles: Perfil[]) =>
    SetMetadata(ROLES_KEY, perfiles);