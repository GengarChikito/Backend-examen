import { IsArray, IsInt, IsPositive, ValidateNested, IsString } from 'class-validator'; // Agrega IsString
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DetalleDto {
  @ApiProperty() @IsInt() @IsPositive() productoId: number;
  @ApiProperty() @IsInt() @IsPositive() cantidad: number;
}

export class CreateBoletaDto {
  @ApiProperty({ type: [DetalleDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleDto)
  detalles: DetalleDto[];

  // 2. NUEVO CAMPO EN EL DTO
  @ApiProperty({ example: 'EFECTIVO' })
  @IsString()
  metodoPago: string;
}