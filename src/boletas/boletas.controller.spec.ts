import { Test, TestingModule } from '@nestjs/testing';
import { BoletasController } from './boletas.controller';
import { BoletasService } from './boletas.service';

describe('BoletasController', () => {
  let controller: BoletasController;
  let service: BoletasService;

  const mockBoletasService = {
    create: jest.fn((dto, user) => Promise.resolve({ id: 1, total: 1000, usuario: user })),
    findAll: jest.fn(() => Promise.resolve([{ id: 1, total: 1000 }])),
    findDaily: jest.fn(() => Promise.resolve([{ id: 2, total: 500 }])), // Para el reporte diario
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoletasController],
      providers: [
        { provide: BoletasService, useValue: mockBoletasService },
      ],
    }).compile();

    controller = module.get<BoletasController>(BoletasController);
    service = module.get<BoletasService>(BoletasService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('create debería registrar una venta usando el usuario del request', async () => {
    const dto = {
      detalles: [{ productoId: 1, cantidad: 1 }],
      metodoPago: 'EFECTIVO'
    } as any;

    // Simulamos el objeto Request que inyecta Passport/NestJS
    const req = { user: { id: 1, email: 'test@test.com' } };

    const result = await controller.create(dto, req);

    expect(result).toEqual({ id: 1, total: 1000, usuario: req.user });
    expect(service.create).toHaveBeenCalledWith(dto, req.user);
  });

  it('findAll debería devolver historial de ventas', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, total: 1000 }]);
  });

  it('findDaily debería devolver ventas del día', async () => {
    expect(await controller.findDaily()).toEqual([{ id: 2, total: 500 }]);
  });
});