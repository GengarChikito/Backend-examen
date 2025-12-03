import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateProductoDto {
  @ApiProperty({ example: 'PlayStation 5', description: 'Nombre del producto' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 500000, description: 'Precio en pesos' })
  @IsNumber()
  @IsPositive()
  precio: number;

  @ApiProperty({ example: 10, description: 'Cantidad en inventario' })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3',
    description: 'URL de la imagen (Opcional)',
    required: false
  })
  @IsString()
  @IsOptional()
  imagen?: string;
}