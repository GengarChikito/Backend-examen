import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateResenaDto } from './update-resena.dto';

describe('UpdateResenaDto', () => {
  it('debería validar una actualización parcial correcta', async () => {
    const dto = plainToInstance(UpdateResenaDto, {
      calificacion: 3,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si la calificación es inválida en el update', async () => {
    const dto = plainToInstance(UpdateResenaDto, {
      calificacion: 10, // Inválido
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('calificacion');
  });
});