import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario, UserRole } from '../entities/usuario.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUserRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'token_mock'),
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
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('debería registrar un usuario correctamente (+18)', async () => {
      const registerDto = {
        nombre: 'Test',
        email: 'test@correo.com',
        password: 'pass',
        fechaNacimiento: '1990-01-01',
      };


      mockUserRepo.create.mockReturnValue(registerDto);
      mockUserRepo.save.mockResolvedValue({ id: 1, ...registerDto, puntosLevelUp: 0 });

      const result = await service.register(registerDto);

      expect(mockUserRepo.create).toHaveBeenCalled();
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id');
    });

    it('debería fallar si es menor de edad', async () => {
      const hoy = new Date();
      const fechaMenor = `${hoy.getFullYear() - 10}-01-01`; // 10 años atrás

      const registerDto = {
        nombre: 'Niño',
        email: 'kid@correo.com',
        password: 'pass',
        fechaNacimiento: fechaMenor,
      };

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('debería retornar token con credenciales válidas', async () => {
      const password = '123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: 1, email: 'a@a.com', password: hashedPassword, role: UserRole.CLIENTE };

      mockUserRepo.findOne.mockResolvedValue(user);

      const result = await service.login('a@a.com', password);
      expect(result).toHaveProperty('access_token');
    });

    it('debería fallar con contraseña incorrecta', async () => {
      const user = { id: 1, email: 'a@a.com', password: 'hashedpassword' };
      mockUserRepo.findOne.mockResolvedValue(user);
      // bcrypt.compare devolverá false porque 'wrong' no coincide

      await expect(service.login('a@a.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });
});