import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  // CAMBIO AQUÍ: Ponemos el correo del Admin como ejemplo por defecto
  @ApiProperty({
    example: 'admin@tienda.cl',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123',
    description: 'Contraseña del usuario',
  })
  @IsString()
  password: string;
}