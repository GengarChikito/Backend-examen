import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('debería llamar a login del servicio', async () => {
      const dto = { email: 'test@test.com', password: '123' };
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });

      await controller.login(dto);
      expect(service.login).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });

  describe('register', () => {
    it('debería llamar a register del servicio', async () => {
      const dto = {
        nombre: 'Nuevo',
        email: 'n@n.com',
        password: '123',
        fechaNacimiento: '2000-01-01'
      };
      await controller.register(dto);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });
});