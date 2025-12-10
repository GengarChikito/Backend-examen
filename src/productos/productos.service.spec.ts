import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from '../entities/producto.entity';
import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('ProductosService', () => {
  let service: ProductosService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: getRepositoryToken(Producto),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar un array de productos', async () => {
      const productos = [{ id: 1, nombre: 'PS5' }];
      mockRepo.find.mockResolvedValue(productos);

      const result = await service.findAll();
      expect(result).toEqual(productos);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar un producto si existe', async () => {
      const producto = { id: 1, nombre: 'PS5' };
      mockRepo.findOneBy.mockResolvedValue(producto);

      const result = await service.findOne(1);
      expect(result).toEqual(producto);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debería crear y guardar un producto', async () => {
      const dto = {
        nombre: 'Switch',
        precio: 300000,
        stock: 10,
        categoria: 'Consolas',
        descripcion: 'Nintendo'
      };
      const savedProducto = { id: 1, ...dto };

      mockRepo.create.mockReturnValue(dto);
      mockRepo.save.mockResolvedValue(savedProducto);

      const result = await service.create(dto);
      expect(result).toEqual(savedProducto);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debería eliminar el producto si no tiene ventas asociadas', async () => {
      // 1. Mockeamos que el producto existe
      mockRepo.findOneBy.mockResolvedValue({ id: 1, nombre: 'Juego Viejo' });
      // 2. Mockeamos que delete es exitoso (no lanza error)
      mockRepo.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.not.toThrow();
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('debería lanzar BadRequestException si el producto tiene ventas (Error FK 1451)', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1 });

      // Simulamos el error de MySQL
      const mysqlError: any = new Error('Foreign key constraint fails');
      mysqlError.errno = 1451;

      mockRepo.delete.mockRejectedValue(mysqlError);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar InternalServerErrorException para otros errores', async () => {
      mockRepo.findOneBy.mockResolvedValue({ id: 1 });
      mockRepo.delete.mockRejectedValue(new Error('Error de conexión'));

      await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
});