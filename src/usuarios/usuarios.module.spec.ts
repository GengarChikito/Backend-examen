import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosModule } from './usuarios.module';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';

describe('UsuariosModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UsuariosModule],
    })
      .overrideProvider(getRepositoryToken(Usuario))
      .useValue({})
      .compile();
  });

  it('debería compilarse correctamente', () => {
    expect(module).toBeDefined();
  });

  it('debería resolver UsuariosService', () => {
    const service = module.get<UsuariosService>(UsuariosService);
    expect(service).toBeDefined();
  });

  it('debería resolver UsuariosController', () => {
    const controller = module.get<UsuariosController>(UsuariosController);
    expect(controller).toBeDefined();
  });
});