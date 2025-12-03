import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario, UserRole } from '../entities/usuario.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo;
  let jwtService;

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Usuario), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(Usuario));
    jwtService = module.get(JwtService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('debería crear un usuario y devolverlo', async () => {
      const dto = { nombre: 'Test', email: 'test@test.com', password: '123' };
      userRepo.create.mockReturnValue(dto);
      userRepo.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.register(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('debería devolver un token si las credenciales son válidas', async () => {
      const password = '123';
      const hash = await bcrypt.hash(password, 10);
      const user = { id: 1, email: 'test@test.com', password: hash, role: UserRole.CLIENTE };

      userRepo.findOne.mockResolvedValue(user);

      const result = await service.login('test@test.com', password);
      expect(result).toEqual({ access_token: 'test_token' });
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      const password = '123';
      const hash = await bcrypt.hash(password, 10);
      const user = { id: 1, email: 'test@test.com', password: hash };

      userRepo.findOne.mockResolvedValue(user);

      await expect(service.login('test@test.com', 'wrong_pass')).rejects.toThrow(UnauthorizedException);
    });
  });
});