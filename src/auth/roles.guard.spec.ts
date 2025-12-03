import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entities/usuario.entity';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('debería estar definido', () => {
    expect(guard).toBeDefined();
  });

  it('debería permitir el acceso si no se requieren roles', () => {
    // Simulamos que el Reflector dice "no hay roles requeridos" (undefined)
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = {
      getHandler: () => {},
      getClass: () => {},
    } as any;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('debería permitir el acceso si el usuario tiene el rol requerido', () => {
    // La ruta pide rol ADMIN
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: UserRole.ADMIN }, // El usuario ES Admin
        }),
      }),
    } as any;

    expect(guard.canActivate(context)).toBe(true);
  });

  it('debería denegar el acceso si el usuario NO tiene el rol requerido', () => {
    // La ruta pide rol ADMIN
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

    const context = {
      getHandler: () => {},
      getClass: () => {},
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: UserRole.CLIENTE }, // El usuario ES Cliente
        }),
      }),
    } as any;

    expect(guard.canActivate(context)).toBe(false);
  });
});