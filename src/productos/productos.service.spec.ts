import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from '../entities/producto.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductosService', () => {
  let service: ProductosService;
  let repo;

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        { provide: getRepositoryToken(Producto), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    repo = module.get(getRepositoryToken(Producto));


    jest.clearAllMocks();
  });

  it('findAll debería devolver un array de productos', async () => {
    const productos = [{ id: 1, nombre: 'P1' }];
    repo.find.mockResolvedValue(productos);
    expect(await service.findAll()).toEqual(productos);
  });

  it('create debería guardar un nuevo producto', async () => {
    const dto = { nombre: 'Nuevo', precio: 100, stock: 10 };
    repo.create.mockReturnValue(dto);
    repo.save.mockResolvedValue({ id: 1, ...dto });

    expect(await service.create(dto)).toEqual({ id: 1, ...dto });
  });



  it('remove debería eliminar un producto existente', async () => {

    repo.findOneBy.mockResolvedValue({ id: 1, nombre: 'Producto Existente' });

    // 2. Simulamos que el delete funciona
    repo.delete.mockResolvedValue({ affected: 1 });

    // 3. Verificamos que no lance error
    await expect(service.remove(1)).resolves.not.toThrow();


    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('remove debería fallar si el producto no existe', async () => {

    repo.findOneBy.mockResolvedValue(null);


    await expect(service.remove(999)).rejects.toThrow(NotFoundException);


    expect(repo.delete).not.toHaveBeenCalled();
  });
});