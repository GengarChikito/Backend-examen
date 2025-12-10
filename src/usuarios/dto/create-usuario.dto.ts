import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../entities/usuario.entity'; // Importamos el Enum

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsEmail({}, { message: 'El formato del correo es inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsDateString({}, { message: 'La fecha debe ser formato ISO (YYYY-MM-DD)' })
  fechaNacimiento: string;

  // --- CAMPOS OPCIONALES ---

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser: admin, vendedor, cliente o invitado' })
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  esEstudianteDuoc?: boolean;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  puntosLevelUp?: number;

  @IsString()
  @IsOptional()
  miCodigoReferido?: string;

  @IsString()
  @IsOptional()
  codigoReferidoUsado?: string;
}