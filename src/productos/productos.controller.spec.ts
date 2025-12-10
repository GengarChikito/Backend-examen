import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        { provide: ProductosService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar el catálogo de productos', async () => {
      const productos = [{ id: 1, nombre: 'PC' }];
      mockService.findAll.mockResolvedValue(productos);

      const result = await controller.findAll();
      expect(result).toEqual(productos);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('debería crear un producto', async () => {
      const dto = {
        nombre: 'Mouse',
        precio: 1000,
        stock: 5,
        categoria: 'Acc',
        descripcion: 'Desc'
      };
      mockService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);
      expect(result).toHaveProperty('id');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('remove', () => {
    it('debería eliminar un producto por ID', async () => {
      mockService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});