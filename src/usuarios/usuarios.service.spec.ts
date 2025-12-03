import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repo;

  const mockRepo = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: getRepositoryToken(Usuario), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    repo = module.get(getRepositoryToken(Usuario));

    jest.clearAllMocks();
  });

  it('findAll debería devolver usuarios', async () => {
    const users = [{ id: 1, nombre: 'Juan' }];
    repo.find.mockResolvedValue(users);
    expect(await service.findAll()).toEqual(users);
  });

  it('update debería modificar un usuario exitosamente', async () => {
    const user = { id: 1, nombre: 'Juan' };
    const changes = { nombre: 'Juan Actualizado' };

    repo.findOneBy.mockResolvedValue(user);
    repo.save.mockResolvedValue({ ...user, ...changes });

    const result = await service.update(1, changes);
    expect(result.nombre).toBe('Juan Actualizado');
    expect(repo.merge).toHaveBeenCalledWith(user, changes);
  });

  it('update debería lanzar ConflictException si el email ya existe', async () => {
    const user = { id: 1, nombre: 'Juan', email: 'juan@test.com' };

    repo.findOneBy.mockResolvedValue(user);

    const errorDuplicado: any = new Error('Duplicate entry');
    errorDuplicado.errno = 1062;
    repo.save.mockRejectedValue(errorDuplicado);

    await expect(service.update(1, { email: 'existente@test.com' }))
      .rejects.toThrow(ConflictException);
  });

  it('update debería lanzar NotFoundException si el usuario no existe', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.update(99, { nombre: 'Nadie' }))
      .rejects.toThrow(NotFoundException);
  });

  it('remove debería eliminar un usuario correctamente', async () => {
    repo.delete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(1);
    expect(result).toEqual({ message: 'Usuario eliminado correctamente' });
  });

  // --- NUEVO TEST AGREGADO ---
  it('remove debería lanzar ConflictException si el usuario tiene ventas asociadas', async () => {
    // Simulamos el error de llave foránea de MySQL (1451)
    const errorReferencia: any = new Error('Foreign key constraint failed');
    errorReferencia.errno = 1451;

    repo.delete.mockRejectedValue(errorReferencia);

    await expect(service.remove(1)).rejects.toThrow(ConflictException);
  });
  // ---------------------------
});