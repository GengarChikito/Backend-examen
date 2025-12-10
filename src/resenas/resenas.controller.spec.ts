import { Test, TestingModule } from '@nestjs/testing';
import { ResenasController } from './resenas.controller';
import { ResenasService } from './resenas.service';

describe('ResenasController', () => {
  let controller: ResenasController;
  let service: ResenasService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByProduct: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResenasController],
      providers: [{ provide: ResenasService, useValue: mockService }],
    }).compile();

    controller = module.get<ResenasController>(ResenasController);
    service = module.get<ResenasService>(ResenasService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debería crear una reseña', async () => {
    const dto = { productoId: 1, texto: 'Ok', calificacion: 5 };
    const req = { user: { id: 1 } };
    mockService.create.mockResolvedValue({ id: 1, ...dto });

    await controller.create(dto, req);
    expect(service.create).toHaveBeenCalledWith(dto, req.user);
  });

  it('debería buscar reseñas por producto', async () => {
    mockService.findByProduct.mockResolvedValue([]);
    await controller.findByProduct('1');
    expect(service.findByProduct).toHaveBeenCalledWith(1);
  });

  it('debería actualizar una reseña', async () => {
    const dto = { texto: 'Edit' };
    const req = { user: { id: 1 } };
    await controller.update('1', dto, req);
    expect(service.update).toHaveBeenCalledWith(1, dto, req.user);
  });

  it('debería eliminar una reseña', async () => {
    const req = { user: { id: 1 } };
    await controller.remove('1', req);
    expect(service.remove).toHaveBeenCalledWith(1, req.user);
  });
});