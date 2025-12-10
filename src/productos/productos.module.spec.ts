import { Test, TestingModule } from '@nestjs/testing';
import { ProductosModule } from './productos.module';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Producto } from '../entities/producto.entity';

describe('ProductosModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductosModule],
    })
      .overrideProvider(getRepositoryToken(Producto))
      .useValue({ find: jest.fn() }) // Mock mínimo del repo
      .compile();
  });

  it('debería compilarse correctamente', () => {
    expect(module).toBeDefined();
  });

  it('debería proveer ProductosService', () => {
    const service = module.get<ProductosService>(ProductosService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(ProductosService);
  });

  it('debería proveer ProductosController', () => {
    const controller = module.get<ProductosController>(ProductosController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(ProductosController);
  });
});