import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateEventoDto } from './create-evento.dto';

describe('CreateEventoDto', () => {
  it('debería validar correctamente un evento válido', async () => {
    const dto = plainToInstance(CreateEventoDto, {
      titulo: 'Torneo LOL',
      puntos: 500,
      ubicacion: 'Online',
      fecha: '2025-12-01',
      hora: '20:00',
      descripcion: 'Gran final',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si faltan campos', async () => {
    const dto = plainToInstance(CreateEventoDto, {
      titulo: 'Incompleto',
      // Faltan puntos, ubicación, etc.
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('debería fallar si los puntos no son positivos', async () => {
    const dto = plainToInstance(CreateEventoDto, {
      titulo: 'Evento Malo',
      puntos: -50, // Error: IsPositive
      ubicacion: 'X',
      fecha: 'X',
      hora: 'X',
      descripcion: 'X',
    });

    const errors = await validate(dto);
    const puntosError = errors.find((e) => e.property === 'puntos');
    expect(puntosError).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(puntosError.constraints).toHaveProperty('isPositive');
  });

  it('debería fallar si el tipo es incorrecto', async () => {
    const dto = plainToInstance(CreateEventoDto, {
      titulo: 123, // Error: debe ser string
      puntos: 'mil', // Error: debe ser int
      ubicacion: 'X',
      fecha: 'X',
      hora: 'X',
      descripcion: 'X',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
