import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  // Permitimos que el frontend envíe 'puntosLevelUp' para actualizar
  @IsNumber()
  @IsOptional()
  puntosLevelUp?: number;
}