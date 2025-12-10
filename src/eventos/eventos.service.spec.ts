import { Test, TestingModule } from '@nestjs/testing';
import { EventosService } from './eventos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Evento } from '../entities/evento.entity';
import { NotFoundException } from '@nestjs/common';

describe('EventosService', () => {
  let service: EventosService;

  const mockEventoRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventosService,
        {
          provide: getRepositoryToken(Evento),
          useValue: mockEventoRepo,
        },
      ],
    }).compile();

    service = module.get<EventosService>(EventosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un evento', async () => {
      const dto = {
        titulo: 'Torneo FIFA',
        puntos: 100,
        ubicacion: 'Santiago',
        fecha: '2025-10-15',
        hora: '18:00',
        descripcion: 'Torneo de eSports',
      };
      const expectedEvento = { id: 1, ...dto };

      mockEventoRepo.create.mockReturnValue(expectedEvento);
      mockEventoRepo.save.mockResolvedValue(expectedEvento);

      const result = await service.create(dto);
      expect(result).toEqual(expectedEvento);
      expect(mockEventoRepo.create).toHaveBeenCalledWith(dto);
      expect(mockEventoRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar una lista de eventos', async () => {
      const eventos = [{ id: 1, titulo: 'E1' }];
      mockEventoRepo.find.mockResolvedValue(eventos);

      const result = await service.findAll();
      expect(result).toEqual(eventos);
    });
  });

  describe('findOne', () => {
    it('debería retornar un evento si existe', async () => {
      const evento = { id: 1, titulo: 'E1' };
      mockEventoRepo.findOneBy.mockResolvedValue(evento);

      const result = await service.findOne(1);
      expect(result).toEqual(evento);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockEventoRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un evento existente', async () => {
      const evento = { id: 1, titulo: 'Original' };
      const dto = { titulo: 'Editado' };
      const updatedEvento = { ...evento, ...dto };

      mockEventoRepo.findOneBy.mockResolvedValue(evento);
      mockEventoRepo.merge.mockImplementation((e, d) => Object.assign(e, d));
      mockEventoRepo.save.mockResolvedValue(updatedEvento);

      const result = await service.update(1, dto);
      expect(result.titulo).toBe('Editado');
      expect(mockEventoRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debería eliminar un evento', async () => {
      const evento = { id: 1, titulo: 'Borrar' };
      mockEventoRepo.findOneBy.mockResolvedValue(evento);
      mockEventoRepo.remove.mockResolvedValue(evento);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Evento eliminado correctamente' });
      expect(mockEventoRepo.remove).toHaveBeenCalledWith(evento);
    });
  });
});