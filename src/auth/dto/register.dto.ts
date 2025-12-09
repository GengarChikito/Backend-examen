import { IsString, IsEmail, MinLength, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString()
  nombre: string;

  @IsEmail({}, { message: 'El correo debe ser válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password: string;

  @IsDateString({}, { message: 'La fecha debe ser válida (YYYY-MM-DD)' })
  fechaNacimiento: string;

  // --- AGREGAMOS ESTOS CAMPOS FALTANTES ---

  @IsString()
  @IsOptional()
  role?: string;

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