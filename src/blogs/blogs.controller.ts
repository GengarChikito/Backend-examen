import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/usuario.entity';

@ApiTags('Blogs')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar blogs (Público autenticado)' })
  findAll() {
    return this.blogsService.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear blog (Solo Admin)' })
  create(@Body() dto: CreateBlogDto) {
    return this.blogsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Editar blog (Solo Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogsService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar blog (Solo Admin)' })
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }
}