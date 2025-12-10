import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from '../entities/blog.entity';
import { NotFoundException } from '@nestjs/common';

describe('BlogsService', () => {
  let service: BlogsService;

  const mockBlogRepo = {
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
        BlogsService,
        {
          provide: getRepositoryToken(Blog),
          useValue: mockBlogRepo,
        },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear y guardar un blog', async () => {
      const dto = {
        titulo: 'Test Blog',
        categoria: 'Tech',
        descripcion: 'Desc',
        fecha: '2025-01-01',
        icono: '📝',
      };
      const expectedBlog = { id: 1, ...dto };

      mockBlogRepo.create.mockReturnValue(expectedBlog);
      mockBlogRepo.save.mockResolvedValue(expectedBlog);

      const result = await service.create(dto);
      expect(result).toEqual(expectedBlog);
      expect(mockBlogRepo.create).toHaveBeenCalledWith(dto);
      expect(mockBlogRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar un array de blogs', async () => {
      const blogs = [{ id: 1, titulo: 'B1' }];
      mockBlogRepo.find.mockResolvedValue(blogs);

      const result = await service.findAll();
      expect(result).toEqual(blogs);
    });
  });

  describe('findOne', () => {
    it('debería retornar un blog si existe', async () => {
      const blog = { id: 1, titulo: 'B1' };
      mockBlogRepo.findOneBy.mockResolvedValue(blog);

      const result = await service.findOne(1);
      expect(result).toEqual(blog);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockBlogRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un blog existente', async () => {
      const blog = { id: 1, titulo: 'Viejo' };
      const dto = { titulo: 'Nuevo' };
      const updatedBlog = { ...blog, ...dto };

      mockBlogRepo.findOneBy.mockResolvedValue(blog);
      mockBlogRepo.merge.mockImplementation((entity, dto) => Object.assign(entity, dto));
      mockBlogRepo.save.mockResolvedValue(updatedBlog);

      const result = await service.update(1, dto);
      expect(result.titulo).toBe('Nuevo');
      expect(mockBlogRepo.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('debería eliminar un blog existente', async () => {
      const blog = { id: 1, titulo: 'Borrar' };
      mockBlogRepo.findOneBy.mockResolvedValue(blog);
      mockBlogRepo.remove.mockResolvedValue(blog);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Blog eliminado correctamente' });
      expect(mockBlogRepo.remove).toHaveBeenCalledWith(blog);
    });
  });
});