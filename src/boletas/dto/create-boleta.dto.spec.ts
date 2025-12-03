import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateBoletaDto } from './create-boleta.dto';

describe('CreateBoletaDto', () => {

  // 1. Test de caso exitoso (debería dar 0 errores)
  it('debería validar correctamente una estructura válida', async () => {
    // Usamos plainToInstance para convertir el objeto plano en una instancia real
    // con todas las reglas de @Type y validación anidada funcionando.
    const dto = plainToInstance(CreateBoletaDto, {
      metodoPago: 'EFECTIVO',
      detalles: [
        { productoId: 1, cantidad: 2 }
      ]
    });

    const errors = await validate(dto);

    // Si esto falla, te mostrará en la consola QUÉ falló
    if (errors.length > 0) {
      console.log('Errores de validación encontrados:', JSON.stringify(errors, null, 2));
    }

    expect(errors.length).toBe(0);
  });

  // 2. Test de fallos (ejemplo: falta el método de pago)
  it('debería fallar si falta el método de pago', async () => {
    const dto = plainToInstance(CreateBoletaDto, {
      // metodoPago: falta intencionalmente
      detalles: [{ productoId: 1, cantidad: 2 }]
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Esperamos al menos 1 error
  });

  // 3. Test de fallos anidados (ejemplo: cantidad negativa)
  it('debería fallar si un detalle es inválido', async () => {
    const dto = plainToInstance(CreateBoletaDto, {
      metodoPago: 'TARJETA',
      detalles: [
        { productoId: 1, cantidad: -5 } // Cantidad negativa inválida
      ]
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});