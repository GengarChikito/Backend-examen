import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

// CORREGIDO: "class" en lugar de "classQr"
export class RegisterDto {
  @ApiProperty({ example: 'Juan Vendedor' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'vendedor@tienda.cl' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'vendedor', required: false })
  @IsString()
  @IsOptional()
  role?: string;
}