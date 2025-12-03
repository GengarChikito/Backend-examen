import { Controller, Get, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/usuario.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateProductoDto } from './dto/create-producto.dto';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener catálogo de productos (Público)' })
  findAll() {
    return this.productosService.findAll();
  }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear producto (Solo Admin)' })
  @ApiResponse({ status: 201, description: 'Producto creado.' })
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token') // Candado
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar producto (Solo Admin)' })
  @ApiParam({ name: 'id', description: 'ID del producto a eliminar', example: 1 }) // ID explícito
  @ApiResponse({ status: 200, description: 'Producto eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}