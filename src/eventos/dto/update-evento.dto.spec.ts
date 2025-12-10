import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateEventoDto } from './update-evento.dto';

describe('UpdateEventoDto', () => {
  it('debería ser válido con un objeto vacío (opcional)', async () => {
    const dto = plainToInstance(UpdateEventoDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería validar si se actualiza solo un campo', async () => {
    const dto = plainToInstance(UpdateEventoDto, {
      ubicacion: 'Nueva Sede',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si se envía un dato inválido', async () => {
    const dto = plainToInstance(UpdateEventoDto, {
      puntos: -100, // Error heredado: IsPositive
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('puntos');
  });
});