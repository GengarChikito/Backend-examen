import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

describe('BlogsController', () => {
  let controller: BlogsController;
  let service: BlogsService;

  const mockBlogsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        {
          provide: BlogsService,
          useValue: mockBlogsService,
        },
      ],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
    service = module.get<BlogsService>(BlogsService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería llamar a service.findAll', async () => {
      const blogs = [{ id: 1, titulo: 'Blog 1' }];
      mockBlogsService.findAll.mockResolvedValue(blogs);

      const result = await controller.findAll();
      expect(result).toEqual(blogs);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('debería llamar a service.create', async () => {
      const dto = {
        titulo: 'Nuevo Blog',
        categoria: 'General',
        descripcion: 'Desc',
        fecha: '2025',
        icono: 'X',
      };
      mockBlogsService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('debería llamar a service.update', async () => {
      const dto = { titulo: 'Editado' };
      mockBlogsService.update.mockResolvedValue({ id: 1, ...dto });

      await controller.update('1', dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('debería llamar a service.remove', async () => {
      mockBlogsService.remove.mockResolvedValue({ message: 'Eliminado' });

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});