import { Controller, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/usuario.entity';
// Importamos el nuevo DTO
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('Usuarios')
@ApiBearerAuth('access-token') // Usa el mismo nombre que en main.ts
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos los usuarios (Solo Admin)' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Editar usuario (Solo Admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario a editar', example: 1 }) // Documentamos el ID
  @ApiBody({ type: UpdateUsuarioDto }) // Documentamos el cuerpo
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(@Param('id') id: string, @Body() body: UpdateUsuarioDto) { // Usamos el DTO
    return this.usuariosService.update(+id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario (Solo Admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar', example: 1 }) // Documentamos el ID
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}