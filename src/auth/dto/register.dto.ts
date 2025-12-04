import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsDateString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'juan@duoc.cl' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123' })
  @IsString()
  password: string;

  @ApiProperty({ example: '1990-01-01', description: 'Debe ser mayor de 18' })
  @IsDateString()
  fechaNacimiento: string;

  @ApiProperty({ example: 'CODIGO123', required: false })
  @IsString()
  @IsOptional()
  codigoReferidoUsado?: string;

  @ApiProperty({ example: 'cliente', required: false })
  @IsString()
  @IsOptional()
  role?: string;
}