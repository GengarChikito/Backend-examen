import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer'; // <--- Importación necesaria

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  // Permitimos que el frontend envíe 'puntosLevelUp' para actualizar
  @Type(() => Number) // <--- Convierte "100" (string) a 100 (number)
  @IsNumber()
  @IsOptional()
  puntosLevelUp?: number;
}