import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  const mockUsuariosService = {
    findAll: jest.fn(() => Promise.resolve([{ id: 1, nombre: 'Juan' }])),
    update: jest.fn((id, data) => Promise.resolve({ id, ...data })),
    remove: jest.fn((id) => Promise.resolve({ message: 'Usuario eliminado' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        { provide: UsuariosService, useValue: mockUsuariosService },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('findAll debería devolver usuarios', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, nombre: 'Juan' }]);
  });

  it('update debería modificar un usuario', async () => {
    const changes = { nombre: 'Juan Actualizado' };
    const result = await controller.update('1', changes); // Pasa ID como string
    expect(result).toEqual({ id: 1, nombre: 'Juan Actualizado' });
    expect(service.update).toHaveBeenCalledWith(1, changes);
  });

  it('remove debería eliminar un usuario', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual({ message: 'Usuario eliminado' });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});