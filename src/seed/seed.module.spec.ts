import { Test, TestingModule } from '@nestjs/testing';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Producto } from '../entities/producto.entity';
import { Evento } from '../entities/evento.entity';
import { Blog } from '../entities/blog.entity';

describe('SeedModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [SeedModule],
    })
      // Debemos mockear todos los repositorios que usa el módulo
      .overrideProvider(getRepositoryToken(Usuario)).useValue({})
      .overrideProvider(getRepositoryToken(Producto)).useValue({})
      .overrideProvider(getRepositoryToken(Evento)).useValue({})
      .overrideProvider(getRepositoryToken(Blog)).useValue({})
      .compile();
  });

  it('debería compilarse correctamente', () => {
    expect(module).toBeDefined();
  });

  it('debería proveer SeedService', () => {
    const service = module.get<SeedService>(SeedService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(SeedService);
  });
});