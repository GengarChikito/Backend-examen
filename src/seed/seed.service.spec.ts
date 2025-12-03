import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Producto } from '../entities/producto.entity';
import { Boleta } from '../entities/boleta.entity';
import { DetalleBoleta } from '../entities/detalle-boleta.entity';

describe('SeedService', () => {
  let service: SeedService;
  let userRepo;
  let productRepo;

  // Mock de los repositorios
  const mockRepo = {
    count: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        // Proveemos mocks para todas las entidades que usa el Seed
        { provide: getRepositoryToken(Usuario), useValue: mockRepo },
        { provide: getRepositoryToken(Producto), useValue: mockRepo },
        { provide: getRepositoryToken(Boleta), useValue: mockRepo },
        { provide: getRepositoryToken(DetalleBoleta), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    userRepo = module.get(getRepositoryToken(Usuario));
    productRepo = module.get(getRepositoryToken(Producto));

    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('debería insertar datos si la base de datos está vacía', async () => {
      // Simulamos que NO hay usuarios ni productos (count = 0)
      mockRepo.count.mockResolvedValue(0);

      // Simulamos que el guardado funciona
      mockRepo.save.mockResolvedValue(true);

      // Ejecutamos el seed
      await service.onModuleInit();

      // Verificamos que haya intentado contar
      expect(mockRepo.count).toHaveBeenCalled();

      // Verificamos que haya intentado guardar (insertar)
      // Se llama al menos 2 veces: una para usuarios, otra para productos
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('NO debería insertar nada si ya existen datos', async () => {
      // Simulamos que YA existen datos (count = 5)
      mockRepo.count.mockResolvedValue(5);

      await service.onModuleInit();

      // Verificamos que contó...
      expect(mockRepo.count).toHaveBeenCalled();

      // ...pero NO debería haber llamado a save()
      expect(mockRepo.save).not.toHaveBeenCalled();
    });
  });
});