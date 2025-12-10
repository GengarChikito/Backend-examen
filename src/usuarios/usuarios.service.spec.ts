import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario, UserRole } from '../entities/usuario.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un usuario y convertir fechaNacimiento', async () => {
      const dto = {
        nombre: 'Nuevo',
        email: 'new@mail.com',
        password: '123',
        fechaNacimiento: '1990-01-01', // String
      };

      const expectedUser = {
        ...dto,
        id: 1,
        fechaNacimiento: new Date('1990-01-01'), // Objeto Date
        role: UserRole.CLIENTE,
      };

      mockRepo.create.mockReturnValue(expectedUser);
      mockRepo.save.mockResolvedValue(expectedUser);

      const result = await service.create(dto as any); // cast any para simular DTO

      expect(result).toEqual(expectedUser);
      expect(result.fechaNacimiento).toBeInstanceOf(Date);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los usuarios', async () => {
      mockRepo.find.mockResolvedValue([{ id: 1, nombre: 'User' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('debería retornar un usuario si existe', async () => {
      const user = { id: 1, nombre: 'Found' };
      mockRepo.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario correctamente', async () => {
      const dto = { nombre: 'Editado' };
      const preloadUser = { id: 1, nombre: 'Editado' };

      mockRepo.preload.mockResolvedValue(preloadUser);
      mockRepo.save.mockResolvedValue(preloadUser);

      const result = await service.update(1, dto);
      expect(result.nombre).toBe('Editado');
      expect(mockRepo.preload).toHaveBeenCalledWith({ id: 1, ...dto });
    });

    it('debería lanzar NotFoundException si el usuario a actualizar no existe', async () => {
      mockRepo.preload.mockResolvedValue(null);
      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un usuario', async () => {
      const user = { id: 1 };
      mockRepo.findOneBy.mockResolvedValue(user);
      mockRepo.remove.mockResolvedValue(user);

      const result = await service.remove(1);
      expect(result).toEqual(user);
      expect(mockRepo.remove).toHaveBeenCalledWith(user);
    });
  });
});