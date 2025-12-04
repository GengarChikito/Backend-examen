import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateResenaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  productoId: number;

  @ApiProperty({ example: 'Excelente producto, muy rápido.' })
  @IsString()
  texto: string;

  @ApiProperty({ example: 5, description: 'Calificación de 1 a 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  calificacion: number;
}