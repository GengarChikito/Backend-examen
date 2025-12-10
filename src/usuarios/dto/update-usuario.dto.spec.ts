import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateUsuarioDto } from './update-usuario.dto';

describe('UpdateUsuarioDto', () => {
  it('debería permitir actualización parcial', async () => {
    const dto = plainToInstance(UpdateUsuarioDto, {
      nombre: 'Pepe Nuevo',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería validar tipos en campos opcionales', async () => {
    const dto = plainToInstance(UpdateUsuarioDto, {
      puntosLevelUp: 'mil', // Error: debe ser number (gracias a @Type y @IsNumber)
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('puntosLevelUp');
  });
});