import { JwtStrategy } from './jwt.strategy';
import { Test, TestingModule } from '@nestjs/testing';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('debería estar definido', () => {
    expect(strategy).toBeDefined();
  });

  it('debería validar y retornar el payload del usuario correctamente', async () => {
    const payload = { sub: 1, email: 'test@test.com', role: 'admin' };

    // Ejecutamos la validación
    const result = await strategy.validate(payload);

    // Esperamos que transforme 'sub' en 'id' y mantenga lo demás
    expect(result).toEqual({
      id: 1,
      email: 'test@test.com',
      role: 'admin'
    });
  });
});