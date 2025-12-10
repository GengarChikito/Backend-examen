import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateResenaDto } from './create-resena.dto';

describe('CreateResenaDto', () => {
  it('debería validar una reseña correcta', async () => {
    const dto = plainToInstance(CreateResenaDto, {
      productoId: 1,
      texto: 'Muy bueno',
      calificacion: 5,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si la calificación es mayor a 5', async () => {
    const dto = plainToInstance(CreateResenaDto, {
      productoId: 1,
      texto: 'Excelente',
      calificacion: 6, // Error: Max 5
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('calificacion');
  });

  it('debería fallar si la calificación es menor a 1', async () => {
    const dto = plainToInstance(CreateResenaDto, {
      productoId: 1,
      texto: 'Malo',
      calificacion: 0, // Error: Min 1
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('calificacion');
  });
});