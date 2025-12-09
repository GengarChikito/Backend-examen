import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

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

  // --- CAMPOS OPCIONALES (Se autogeneran o son para admin) ---

  @IsString()
  @IsOptional()
  role?: string; // 'admin' | 'cliente'

  @IsBoolean()
  @IsOptional()
  esEstudianteDuoc?: boolean;

  @IsNumber()
  @IsOptional()
  puntosLevelUp?: number;

  @IsString()
  @IsOptional()
  miCodigoReferido?: string;

  @IsString()
  @IsOptional()
  codigoReferidoUsado?: string; // El código de quien lo invitó
}