import { Test, TestingModule } from '@nestjs/testing';
import { BlogsModule } from './blogs.module';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from '../entities/blog.entity';

describe('BlogsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [BlogsModule],
    })
      .overrideProvider(getRepositoryToken(Blog))
      .useValue({
        find: jest.fn(),
        save: jest.fn(),
      })
      .compile();
  });

  it('debería compilarse correctamente', () => {
    expect(module).toBeDefined();
  });

  it('debería resolver BlogsService', () => {
    const service = module.get<BlogsService>(BlogsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(BlogsService);
  });

  it('debería resolver BlogsController', () => {
    const controller = module.get<BlogsController>(BlogsController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(BlogsController);
  });
});