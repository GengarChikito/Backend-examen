import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Ventas')
@ApiBearerAuth('access-token') // Protege todo el controlador en Swagger
@UseGuards(AuthGuard('jwt'))
@Controller('boletas')
export class BoletasController {
  constructor(private readonly boletasService: BoletasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva venta' })
  @ApiResponse({ status: 201, description: 'Boleta creada y stock descontado.' })
  @ApiResponse({ status: 400, description: 'Stock insuficiente.' })
  create(@Body() dto: CreateBoletaDto, @Request() req) {
    return this.boletasService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Ver historial completo de ventas' })
  @ApiResponse({ status: 200, description: 'Lista de todas las boletas.' })
  findAll() {
    return this.boletasService.findAll();
  }

  @Get('diarias')
  @ApiOperation({ summary: 'Ver reporte de ventas de HOY' })
  @ApiResponse({ status: 200, description: 'Lista de boletas generadas hoy.' })
  findDaily() {
    return this.boletasService.findDaily();
  }
}