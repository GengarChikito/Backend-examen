import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_SECRET') return 'test_secret';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('debería estar definida', () => {
    expect(strategy).toBeDefined();
  });

  it('debería validar y retornar el payload del usuario', async () => {
    const payload = { sub: 1, email: 'test@test.com', role: 'admin' };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      role: 'admin'
    });
  });
});