import { Test, TestingModule } from '@nestjs/testing';
import { ResenasService } from './resenas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resena } from '../entities/resena.entity';
import { Producto } from '../entities/producto.entity';
import { Usuario, UserRole } from '../entities/usuario.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ResenasService', () => {
  let service: ResenasService;

  const mockResenaRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockProductoRepo = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResenasService,
        { provide: getRepositoryToken(Resena), useValue: mockResenaRepo },
        { provide: getRepositoryToken(Producto), useValue: mockProductoRepo },
      ],
    }).compile();

    service = module.get<ResenasService>(ResenasService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear una reseña si el producto existe', async () => {
      const dto = { productoId: 1, texto: 'Genial', calificacion: 5 };
      const user = { id: 1 } as Usuario;
      const producto = { id: 1, nombre: 'PC' } as Producto;

      mockProductoRepo.findOneBy.mockResolvedValue(producto);
      mockResenaRepo.create.mockReturnValue({ ...dto, producto, usuario: user });
      mockResenaRepo.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto, user);
      expect(result).toHaveProperty('id');
      expect(mockResenaRepo.save).toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException si el producto no existe', async () => {
      mockProductoRepo.findOneBy.mockResolvedValue(null);
      await expect(service.create({ productoId: 99, texto: '', calificacion: 5 }, {}))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const resenaMock = {
      id: 1,
      texto: 'Old',
      usuario: { id: 10 } // Dueño es usuario 10
    };

    it('debería permitir editar al dueño de la reseña', async () => {
      mockResenaRepo.findOne.mockResolvedValue(resenaMock);
      mockResenaRepo.save.mockResolvedValue({ ...resenaMock, texto: 'New' });

      // Usuario 10 edita su propia reseña
      const result = await service.update(1, { texto: 'New' }, { id: 10 });
      expect(result.texto).toBe('New');
    });

    it('debería lanzar ForbiddenException si intenta editar otro usuario', async () => {
      mockResenaRepo.findOne.mockResolvedValue(resenaMock);
      // Usuario 20 intenta editar reseña del usuario 10
      await expect(service.update(1, { texto: 'New' }, { id: 20 }))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    const resenaMock = {
      id: 1,
      usuario: { id: 10 } // Dueño es usuario 10
    };

    it('debería permitir eliminar al dueño', async () => {
      mockResenaRepo.findOne.mockResolvedValue(resenaMock);
      mockResenaRepo.remove.mockResolvedValue({});

      await expect(service.remove(1, { id: 10, role: UserRole.CLIENTE }))
        .resolves.not.toThrow();
    });

    it('debería permitir eliminar a un ADMIN (aunque no sea dueño)', async () => {
      mockResenaRepo.findOne.mockResolvedValue(resenaMock);
      mockResenaRepo.remove.mockResolvedValue({});

      // Usuario 99 (Admin) borra reseña de usuario 10
      await expect(service.remove(1, { id: 99, role: UserRole.ADMIN }))
        .resolves.not.toThrow();
    });

    it('debería bloquear a un usuario ajeno', async () => {
      mockResenaRepo.findOne.mockResolvedValue(resenaMock);
      // Usuario 20 (Cliente) intenta borrar reseña de usuario 10
      await expect(service.remove(1, { id: 20, role: UserRole.CLIENTE }))
        .rejects.toThrow(ForbiddenException);
    });
  });
});