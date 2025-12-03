import { Test, TestingModule } from '@nestjs/testing';
import { BoletasService } from './boletas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Boleta } from '../entities/boleta.entity';
import { Producto } from '../entities/producto.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Between } from 'typeorm';

describe('BoletasService', () => {
  let service: BoletasService;
  let boletaRepo;
  let productRepo;

  const mockBoletaRepo = {
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockProductRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoletasService,
        { provide: getRepositoryToken(Boleta), useValue: mockBoletaRepo },
        { provide: getRepositoryToken(Producto), useValue: mockProductRepo },
      ],
    }).compile();

    service = module.get<BoletasService>(BoletasService);
    boletaRepo = module.get(getRepositoryToken(Boleta));
    productRepo = module.get(getRepositoryToken(Producto));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debería crear una boleta simple si hay stock', async () => {
      const usuario = { id: 1 };
      const dto = {
        detalles: [{ productoId: 1, cantidad: 2 }],
        metodoPago: 'EFECTIVO'
      };

      const productoMock = { id: 1, nombre: 'Test', precio: 100, stock: 10 };

      mockProductRepo.findOneBy.mockResolvedValue(productoMock);
      mockProductRepo.save.mockResolvedValue(true);
      mockBoletaRepo.save.mockImplementation((boleta) => Promise.resolve({ id: 1, ...boleta }));

      const result = await service.create(dto as any, usuario);

      expect(result).toHaveProperty('total', 200); // 2 * 100
      expect(mockProductRepo.save).toHaveBeenCalled();
    });

    // --- NUEVO TEST AGREGADO ---
    it('debería calcular el total correctamente con múltiples productos', async () => {
      const usuario = { id: 1 };
      const dto = {
        detalles: [
          { productoId: 1, cantidad: 2 }, // 2 * 100 = 200
          { productoId: 2, cantidad: 1 }  // 1 * 500 = 500
        ],
        metodoPago: 'EFECTIVO'
      };


      mockProductRepo.findOneBy.mockImplementation(({ id }) => {
        if (id === 1) return Promise.resolve({ id: 1, nombre: 'P1', precio: 100, stock: 10 });
        if (id === 2) return Promise.resolve({ id: 2, nombre: 'P2', precio: 500, stock: 5 });
        return Promise.resolve(null);
      });

      mockProductRepo.save.mockResolvedValue(true);
      mockBoletaRepo.save.mockImplementation((b) => Promise.resolve({ id: 1, ...b }));

      const result = await service.create(dto as any, usuario);


      expect(result.total).toBe(700);
      expect(mockProductRepo.save).toHaveBeenCalledTimes(2);
    });


    it('debería fallar si no hay stock suficiente', async () => {
      const usuario = { id: 1 };
      const dto = { detalles: [{ productoId: 1, cantidad: 20 }], metodoPago: 'EFECTIVO' };
      const productoMock = { id: 1, nombre: 'Test', precio: 100, stock: 5 };

      mockProductRepo.findOneBy.mockResolvedValue(productoMock);

      await expect(service.create(dto as any, usuario)).rejects.toThrow(BadRequestException);
    });

    it('debería fallar si el producto no existe', async () => {
      const usuario = { id: 1 };
      const dto = { detalles: [{ productoId: 999, cantidad: 1 }], metodoPago: 'EFECTIVO' };

      mockProductRepo.findOneBy.mockResolvedValue(null);

      await expect(service.create(dto as any, usuario)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Lectura de Boletas', () => {
    it('findAll debería devolver todas las boletas ordenadas', async () => {
      const boletas = [{ id: 1, total: 1000 }];
      mockBoletaRepo.find.mockResolvedValue(boletas);

      const result = await service.findAll();
      expect(result).toEqual(boletas);
      expect(mockBoletaRepo.find).toHaveBeenCalledWith({
        relations: ['usuario', 'detalles', 'detalles.producto'],
        order: { fecha: 'DESC' },
      });
    });

    it('findDaily debería buscar boletas del día actual', async () => {
      const boletasHoy = [{ id: 2, total: 500 }];
      mockBoletaRepo.find.mockResolvedValue(boletasHoy);

      const result = await service.findDaily();

      expect(result).toEqual(boletasHoy);
      expect(mockBoletaRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            fecha: expect.anything()
          },
          relations: ['usuario', 'detalles', 'detalles.producto'],
          order: { fecha: 'DESC' }
        })
      );
    });
  });
});