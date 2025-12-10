import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        AuthModule,
        // SOLUCIÓN: Importamos ConfigModule para que ConfigService esté disponible
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ JWT_SECRET: 'test_secret', JWT_EXPIRES_IN: '1h' })], // Carga valores de prueba
        }),
      ],
    })
      // Sobrescribimos el Repositorio de Usuario
      .overrideProvider(getRepositoryToken(Usuario))
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      })
      // Sobrescribimos el ConfigService para asegurarnos que JwtStrategy reciba los valores esperados
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn((key: string) => {
          if (key === 'JWT_SECRET') return 'test_secret_key';
          if (key === 'JWT_EXPIRES_IN') return '1h';
          return null;
        }),
      })
      .compile();
  });

  it('debería compilarse correctamente', () => {
    expect(module).toBeDefined();
  });

  it('debería resolver e instanciar AuthService', () => {
    const service = module.get<AuthService>(AuthService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AuthService);
  });

  it('debería resolver e instanciar AuthController', () => {
    const controller = module.get<AuthController>(AuthController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AuthController);
  });

  it('debería resolver e instanciar JwtStrategy', () => {
    const strategy = module.get<JwtStrategy>(JwtStrategy);
    expect(strategy).toBeDefined();
    expect(strategy).toBeInstanceOf(JwtStrategy);
  });
});