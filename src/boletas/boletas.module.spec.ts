import { Test, TestingModule } from '@nestjs/testing';
import { BoletasModule } from './boletas.module';
import { BoletasService } from './boletas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Boleta } from '../entities/boleta.entity';
import { DetalleBoleta } from '../entities/detalle-boleta.entity';
import { Producto } from '../entities/producto.entity';
import { Usuario } from '../entities/usuario.entity';

describe('BoletasModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [BoletasModule],
    })
      .overrideProvider(getRepositoryToken(Boleta)).useValue({})
      .overrideProvider(getRepositoryToken(DetalleBoleta)).useValue({})
      .overrideProvider(getRepositoryToken(Producto)).useValue({})
      .overrideProvider(getRepositoryToken(Usuario)).useValue({})
      .compile();
  });

  it('debería compilarse correctamente', () => {
    expect(module).toBeDefined();
  });

  it('debería proveer BoletasService', () => {
    const service = module.get<BoletasService>(BoletasService);
    expect(service).toBeDefined();
  });
});