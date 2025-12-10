import { Test, TestingModule } from '@nestjs/testing';
import { BoletasService } from './boletas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Boleta } from '../entities/boleta.entity';
import { Producto } from '../entities/producto.entity';
import { Usuario } from '../entities/usuario.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BoletasService', () => {
  let service: BoletasService;

  // Mocks de Repositorios
  const mockBoletaRepo = {
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockProdRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockUserRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoletasService,
        { provide: getRepositoryToken(Boleta), useValue: mockBoletaRepo },
        { provide: getRepositoryToken(Producto), useValue: mockProdRepo },
        { provide: getRepositoryToken(Usuario), useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<BoletasService>(BoletasService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    // Datos de prueba comunes
    const usuarioMock = {
      id: 1,
      nombre: 'Gamer',
      esEstudianteDuoc: false,
      puntosLevelUp: 0,
    } as Usuario;

    const productoMock = {
      id: 1,
      nombre: 'Juego',
      precio: 10000,
      stock: 5,
    } as Producto;

    const dto = {
      metodoPago: 'EFECTIVO',
      detalles: [{ productoId: 1, cantidad: 2 }],
    };

    it('debería crear una boleta exitosamente y descontar stock', async () => {
      mockUserRepo.findOneBy.mockResolvedValue({ ...usuarioMock });
      mockProdRepo.findOneBy.mockResolvedValue({ ...productoMock });

      // Simulamos que al guardar devuelve la boleta con ID
      mockBoletaRepo.save.mockImplementation((boleta) => Promise.resolve({ id: 1, ...boleta }));

      const result = await service.create(dto, { id: 1 });

      // Verificaciones
      expect(result).toBeDefined();
      expect(result.total).toBe(20000); // 2 * 10000 (sin descuento)
      expect(mockProdRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ stock: 3 }) // 5 - 2 = 3
      );
      // Puntos ganados: 5% de 20.000 = 1.000
      expect(mockUserRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ puntosLevelUp: 1000 })
      );
    });

    it('debería aplicar Descuento DUOC (20%) si corresponde', async () => {
      const usuarioDuoc = { ...usuarioMock, esEstudianteDuoc: true };
      mockUserRepo.findOneBy.mockResolvedValue(usuarioDuoc);
      mockProdRepo.findOneBy.mockResolvedValue({ ...productoMock });
      mockBoletaRepo.save.mockImplementation((b) => Promise.resolve(b));

      const result = await service.create(dto, { id: 1 });

      // Subtotal: 20.000
      // Descuento 20%: 4.000
      // Total: 16.000
      expect(result.descuentoAplicado).toBe(4000);
      expect(result.total).toBe(16000);
    });

    it('debería aplicar Descuento por Nivel si es mejor que el de Duoc', async () => {
      // Usuario con 8000 puntos (Master Gamer -> 25% descuento)
      const usuarioPro = { ...usuarioMock, puntosLevelUp: 8000, esEstudianteDuoc: true };

      mockUserRepo.findOneBy.mockResolvedValue(usuarioPro);
      mockProdRepo.findOneBy.mockResolvedValue({ ...productoMock });
      mockBoletaRepo.save.mockImplementation((b) => Promise.resolve(b));

      const result = await service.create(dto, { id: 1 });

      // Subtotal: 20.000
      // Duoc da 20% (4.000), pero Nivel da 25% (5.000)
      // Debe aplicar 5.000
      expect(result.descuentoAplicado).toBe(5000);
      expect(result.total).toBe(15000);
    });

    it('debería fallar si no hay stock suficiente', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(usuarioMock);
      mockProdRepo.findOneBy.mockResolvedValue({ ...productoMock, stock: 1 }); // Solo 1 en stock

      const dtoExcesivo = { ...dto, detalles: [{ productoId: 1, cantidad: 2 }] }; // Pide 2

      await expect(service.create(dtoExcesivo, { id: 1 })).rejects.toThrow(BadRequestException);
    });

    it('debería fallar si el producto no existe', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(usuarioMock);
      mockProdRepo.findOneBy.mockResolvedValue(null); // Producto no encontrado

      await expect(service.create(dto, { id: 1 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todas las boletas', async () => {
      mockBoletaRepo.find.mockResolvedValue([{ id: 1 }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(mockBoletaRepo.find).toHaveBeenCalled();
    });
  });
});