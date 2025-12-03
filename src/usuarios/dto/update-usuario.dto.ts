import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from '../../auth/dto/register.dto'; // Importamos el DTO de registro

// PartialType hace que todos los campos de RegisterDto sean opcionales automáticamente
export class UpdateUsuarioDto extends PartialType(RegisterDto) {}