import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateBoletaDto } from './create-boleta.dto';

describe('CreateBoletaDto', () => {
  it('debería validar una boleta correcta', async () => {
    const dto = plainToInstance(CreateBoletaDto, {
      metodoPago: 'TARJETA',
      detalles: [
        { productoId: 1, cantidad: 2 },
        { productoId: 5, cantidad: 1 },
      ],
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si falta el método de pago', async () => {
    const dto = plainToInstance(CreateBoletaDto, {
      detalles: [{ productoId: 1, cantidad: 1 }],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('metodoPago');
  });

  it('debería fallar si los detalles no son un array', async () => {
    const dto = plainToInstance(CreateBoletaDto, {
      metodoPago: 'EFECTIVO',
      detalles: 'esto no es un array', // Error de tipo
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('detalles');
  });

  it('debería fallar si un detalle tiene cantidad negativa', async () => {
    const dto = plainToInstance(CreateBoletaDto, {
      metodoPago: 'EFECTIVO',
      detalles: [
        { productoId: 1, cantidad: -5 }, // Error: cantidad negativa
      ],
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    // El error estará dentro de la propiedad 'detalles'
    expect(errors[0].property).toBe('detalles');
  });
});