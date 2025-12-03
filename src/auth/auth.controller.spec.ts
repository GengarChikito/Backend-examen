import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn(() => Promise.resolve({ access_token: 'token' })),
    register: jest.fn(() => Promise.resolve({ id: 1, email: 'test@test.com' })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('debería hacer login', async () => {
    expect(await controller.login({ email: 'a', password: 'b' } as any)).toEqual({ access_token: 'token' });
  });

  it('debería registrar usuario', async () => {
    expect(await controller.register({} as any)).toEqual({ id: 1, email: 'test@test.com' });
  });
});