import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ example: 'PlayStation 5' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Consolas', description: 'Categoría del producto' })
  @IsString()
  categoria: string;

  @ApiProperty({ example: 'Consola de última generación...' })
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @IsPositive()
  precio: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imagen?: string;
}