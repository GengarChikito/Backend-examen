import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Resenas')
@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crear una reseña' })
  create(@Body() dto: CreateResenaDto, @Request() req) {
    return this.resenasService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todas las reseñas (Muro de la fama)' })
  findAll() {
    return this.resenasService.findAll();
  }

  @Get('producto/:id')
  @ApiOperation({ summary: 'Ver reseñas de un producto específico' })
  findByProduct(@Param('id') id: string) {
    return this.resenasService.findByProduct(+id);
  }

  // --- NUEVOS ENDPOINTS ---

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Editar reseña (Solo dueño)' })
  @ApiParam({ name: 'id', example: 1 })
  update(@Param('id') id: string, @Body() dto: UpdateResenaDto, @Request() req) {
    return this.resenasService.update(+id, dto, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar reseña (Dueño o Admin)' })
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id') id: string, @Request() req) {
    return this.resenasService.remove(+id, req.user);
  }
}