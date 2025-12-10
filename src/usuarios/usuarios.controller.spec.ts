import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { UserRole } from '../entities/usuario.entity';
import { ForbiddenException } from '@nestjs/common';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        { provide: UsuariosService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería llamar a findAll del servicio', async () => {
      mockService.findAll.mockResolvedValue([]);
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería permitir ver su propio perfil', async () => {
      const req = { user: { id: 1, role: UserRole.CLIENTE } };
      mockService.findOne.mockResolvedValue({ id: 1 });

      await controller.findOne('1', req);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('debería permitir al ADMIN ver cualquier perfil', async () => {
      const req = { user: { id: 99, role: UserRole.ADMIN } }; // Admin ID 99 ve perfil ID 1
      mockService.findOne.mockResolvedValue({ id: 1 });

      await controller.findOne('1', req);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('debería BLOQUEAR si un cliente intenta ver otro perfil', () => {
      const req = { user: { id: 2, role: UserRole.CLIENTE } }; // Usuario 2 intenta ver perfil 1

      // CORRECCIÓN: Usamos una función envolvente y quitamos 'await' y '.rejects'
      // porque el error se lanza de forma síncrona en el controlador.
      expect(() => controller.findOne('1', req)).toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('debería permitir editar su propio perfil', async () => {
      const req = { user: { id: 1, role: UserRole.CLIENTE } };
      const dto = { nombre: 'Yo' };
      mockService.update.mockResolvedValue({ id: 1, ...dto });

      await controller.update('1', dto, req);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('debería BLOQUEAR edición de perfil ajeno si no es admin', () => {
      const req = { user: { id: 2, role: UserRole.CLIENTE } }; // Usuario 2 intenta editar usuario 1
      const dto = { nombre: 'Hacker' };

      // CORRECCIÓN: Igual que arriba, validación síncrona
      expect(() => controller.update('1', dto, req)).toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('debería llamar a remove del servicio', async () => {
      mockService.remove.mockResolvedValue({});
      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});