import { Controller, Get, Patch, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('Usuarios')
@ApiBearerAuth('access-token')
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

  // --- NUEVO ENDPOINT AGREGADO ---
  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil de usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  findOne(@Param('id') id: string, @Request() req) {
    // Validación: Solo el mismo usuario o un admin pueden ver los datos
    // Nota: El '+' convierte el id de string a número para la comparación
    if (req.user.id !== +id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes permiso para ver este perfil');
    }
    return this.usuariosService.findOne(+id);
  }
  // -------------------------------

  @Patch(':id')
  @ApiOperation({ summary: 'Editar usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario a editar', example: 1 })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(@Param('id') id: string, @Body() body: UpdateUsuarioDto, @Request() req) {
    // Validación de seguridad: solo uno mismo o el admin puede editar
    if (req.user.id !== +id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes permiso para editar este usuario');
    }
    return this.usuariosService.update(+id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario (Solo Admin)' })
  @ApiParam({ name: 'id', description: 'ID del usuario a eliminar', example: 1 })
  @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}