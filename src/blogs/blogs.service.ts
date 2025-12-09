import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private blogRepo: Repository<Blog>,
  ) {}

  async create(dto: CreateBlogDto) {
    const blog = this.blogRepo.create(dto);
    return await this.blogRepo.save(blog);
  }

  async findAll() {
    return await this.blogRepo.find();
  }

  async findOne(id: number) {
    const blog = await this.blogRepo.findOneBy({ id });
    if (!blog) throw new NotFoundException('Blog no encontrado');
    return blog;
  }

  async update(id: number, dto: UpdateBlogDto) {
    const blog = await this.findOne(id);
    this.blogRepo.merge(blog, dto);
    return await this.blogRepo.save(blog);
  }

  async remove(id: number) {
    const blog = await this.findOne(id);
    await this.blogRepo.remove(blog);
    return { message: 'Blog eliminado correctamente' };
  }
}