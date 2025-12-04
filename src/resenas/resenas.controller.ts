import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ResenasService } from './resenas.service';
import { CreateResenaDto } from './dto/create-resena.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Resenas')
@Controller('resenas')
export class ResenasController {
  constructor(private readonly resenasService: ResenasService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crear una reseña para un producto' })
  create(@Body() dto: CreateResenaDto, @Request() req) {
    return this.resenasService.create(dto, req.user);
  }

  @Get('producto/:id')
  @ApiOperation({ summary: 'Ver reseñas de un producto' })
  findByProduct(@Param('id') id: string) {
    return this.resenasService.findByProduct(+id);
  }

  // 2. NUEVO ENDPOINT AGREGADO
  @Get()
  @ApiOperation({ summary: 'Ver todas las reseñas (Muro de la fama)' })
  findAll() {
    return this.resenasService.findAll();
  }
}