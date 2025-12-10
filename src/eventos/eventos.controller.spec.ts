import { Test, TestingModule } from '@nestjs/testing';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';

describe('EventosController', () => {
  let controller: EventosController;
  let service: EventosService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventosController],
      providers: [
        {
          provide: EventosService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<EventosController>(EventosController);
    service = module.get<EventosService>(EventosService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería obtener todos los eventos', async () => {
      mockService.findAll.mockResolvedValue([]);
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('debería crear un evento', async () => {
      const dto = {
        titulo: 'Nuevo',
        puntos: 100,
        ubicacion: 'Lugar',
        fecha: 'Fecha',
        hora: 'Hora',
        descripcion: 'Desc',
      };
      mockService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('debería actualizar un evento', async () => {
      const dto = { puntos: 200 };
      mockService.update.mockResolvedValue({ id: 1, puntos: 200 });

      await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('debería eliminar un evento', async () => {
      mockService.remove.mockResolvedValue({ message: 'OK' });

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});