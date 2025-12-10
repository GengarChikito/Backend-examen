import { Test, TestingModule } from '@nestjs/testing';
import { ResenasModule } from './resenas.module';
import { ResenasService } from './resenas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Resena } from '../entities/resena.entity';
import { Producto } from '../entities/producto.entity';
import { Usuario } from '../entities/usuario.entity';

describe('ResenasModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ResenasModule],
    })
      .overrideProvider(getRepositoryToken(Resena)).useValue({})
      .overrideProvider(getRepositoryToken(Producto)).useValue({})
      .overrideProvider(getRepositoryToken(Usuario)).useValue({})
      .compile();
  });

  it('debería compilarse correctamente', () => {
    expect(module).toBeDefined();
  });

  it('debería proveer ResenasService', () => {
    const service = module.get<ResenasService>(ResenasService);
    expect(service).toBeDefined();
  });
});