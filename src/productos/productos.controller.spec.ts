import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  // Mock del servicio
  const mockProductosService = {
    findAll: jest.fn(() => Promise.resolve([{ id: 1, nombre: 'Producto Test' }])),
    create: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    remove: jest.fn((id) => Promise.resolve({ deleted: true, id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        { provide: ProductosService, useValue: mockProductosService },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('findAll debería devolver una lista de productos', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 1, nombre: 'Producto Test' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('create debería crear un producto', async () => {
    const dto = { nombre: 'Nuevo', precio: 100, stock: 10 };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('remove debería eliminar un producto por ID', async () => {
    const result = await controller.remove('1'); // Ojo: los params vienen como string
    expect(result).toEqual({ deleted: true, id: 1 }); // El controller lo pasa a número con +id
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});