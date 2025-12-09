import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty({ example: 'Torneo FIFA' })
  @IsString()
  titulo: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @IsPositive()
  puntos: number;

  @ApiProperty({ example: 'Santiago Centro' })
  @IsString()
  ubicacion: string;

  @ApiProperty({ example: '15 de Octubre, 2025' })
  @IsString()
  fecha: string;

  @ApiProperty({ example: '18:00 - 23:00 hrs' })
  @IsString()
  hora: string;

  @ApiProperty({ example: 'Descripción del evento...' })
  @IsString()
  descripcion: string;
}