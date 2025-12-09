import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'Cómo armar tu PC' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Guías' })
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiProperty({ example: 'Contenido del artículo...' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ example: '10 Octubre, 2025' })
  @IsString()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty({ example: '🎮' })
  @IsString()
  @IsNotEmpty()
  icono: string;
}