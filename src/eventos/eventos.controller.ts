import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/usuario.entity';

@ApiTags('Eventos')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt')) // Todos los endpoints requieren login
@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar eventos (Usuarios y Admin)' })
  findAll() {
    return this.eventosService.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo Admin
  @ApiOperation({ summary: 'Crear evento (Solo Admin)' })
  create(@Body() dto: CreateEventoDto) {
    return this.eventosService.create(dto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo Admin
  @ApiOperation({ summary: 'Editar evento (Solo Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateEventoDto) {
    return this.eventosService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo Admin
  @ApiOperation({ summary: 'Eliminar evento (Solo Admin)' })
  remove(@Param('id') id: string) {
    return this.eventosService.remove(+id);
  }
}