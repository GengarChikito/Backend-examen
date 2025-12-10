import { Test, TestingModule } from '@nestjs/testing';
import { EventosModule } from './eventos.module';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Evento } from '../entities/evento.entity';

describe('EventosModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [EventosModule],
    })
      .overrideProvider(getRepositoryToken(Evento))
      .useValue({
        find: jest.fn(),
        save: jest.fn(),
      })
      .compile();
  });

  it('debería compilarse correctamente', () => {
    expect(module).toBeDefined();
  });

  it('debería resolver EventosService', () => {
    const service = module.get<EventosService>(EventosService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(EventosService);
  });

  it('debería resolver EventosController', () => {
    const controller = module.get<EventosController>(EventosController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(EventosController);
  });
});