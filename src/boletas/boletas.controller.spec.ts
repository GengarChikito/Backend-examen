import { Test, TestingModule } from '@nestjs/testing';
import { BoletasController } from './boletas.controller';
import { BoletasService } from './boletas.service';

describe('BoletasController', () => {
  let controller: BoletasController;
  let service: BoletasService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findDaily: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoletasController],
      providers: [{ provide: BoletasService, useValue: mockService }],
    }).compile();

    controller = module.get<BoletasController>(BoletasController);
    service = module.get<BoletasService>(BoletasService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar al servicio para crear una venta', async () => {
      const dto = { metodoPago: 'EFECTIVO', detalles: [] };
      const req = { user: { id: 1 } };
      mockService.create.mockResolvedValue({ id: 100, total: 5000 });

      const result = await controller.create(dto, req);
      expect(service.create).toHaveBeenCalledWith(dto, req.user);
      expect(result).toEqual({ id: 100, total: 5000 });
    });
  });

  describe('findAll', () => {
    it('debería obtener el historial de ventas', async () => {
      mockService.findAll.mockResolvedValue([]);
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findDaily', () => {
    it('debería obtener el reporte diario', async () => {
      mockService.findDaily.mockResolvedValue([]);
      await controller.findDaily();
      expect(service.findDaily).toHaveBeenCalled();
    });
  });
});