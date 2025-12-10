import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Producto } from '../entities/producto.entity';
import { Evento } from '../entities/evento.entity';
import { Blog } from '../entities/blog.entity';

describe('SeedService', () => {
  let service: SeedService;

  // Mock genérico para los repositorios
  const createMockRepo = () => ({
    count: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn((ent) => Promise.resolve(ent)),
  });

  const mockUserRepo = createMockRepo();
  const mockProdRepo = createMockRepo();
  const mockEventRepo = createMockRepo();
  const mockBlogRepo = createMockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(Usuario), useValue: mockUserRepo },
        { provide: getRepositoryToken(Producto), useValue: mockProdRepo },
        { provide: getRepositoryToken(Evento), useValue: mockEventRepo },
        { provide: getRepositoryToken(Blog), useValue: mockBlogRepo },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit (Base de datos vacía)', () => {
    it('debería insertar datos si las tablas están vacías', async () => {
      // Simulamos que no hay registros (count = 0)
      mockUserRepo.count.mockResolvedValue(0);
      mockProdRepo.count.mockResolvedValue(0);
      mockEventRepo.count.mockResolvedValue(0);
      mockBlogRepo.count.mockResolvedValue(0);

      await service.onModuleInit();

      // Verificamos que se llamó a save() en cada repositorio
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(mockProdRepo.save).toHaveBeenCalled();
      expect(mockEventRepo.save).toHaveBeenCalled();
      expect(mockBlogRepo.save).toHaveBeenCalled();
    });
  });

  describe('onModuleInit (Base de datos poblada)', () => {
    it('NO debería insertar nada si ya existen registros', async () => {
      // Simulamos que YA existen registros (count > 0)
      mockUserRepo.count.mockResolvedValue(5);
      mockProdRepo.count.mockResolvedValue(10);
      mockEventRepo.count.mockResolvedValue(3);
      mockBlogRepo.count.mockResolvedValue(3);

      await service.onModuleInit();

      // Verificamos que NO se llamó a save()
      expect(mockUserRepo.save).not.toHaveBeenCalled();
      expect(mockProdRepo.save).not.toHaveBeenCalled();
      expect(mockEventRepo.save).not.toHaveBeenCalled();
      expect(mockBlogRepo.save).not.toHaveBeenCalled();
    });
  });
});