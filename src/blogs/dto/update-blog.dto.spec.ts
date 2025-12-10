import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateBlogDto } from './update-blog.dto';

describe('UpdateBlogDto', () => {
  // 1. Caso Exitoso: Objeto vacío (todo es opcional)
  it('debería ser válido si el objeto está vacío', async () => {
    const dto = plainToInstance(UpdateBlogDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  // 2. Caso Exitoso: Actualización parcial
  it('debería validar si solo se envía un campo correcto', async () => {
    const dto = plainToInstance(UpdateBlogDto, {
      titulo: 'Nuevo Título Actualizado',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  // 3. Validación de Tipos en campos opcionales
  it('debería fallar si se envía un campo con tipo incorrecto', async () => {
    const dto = plainToInstance(UpdateBlogDto, {
      titulo: 12345, // Error: si se envía, debe ser string
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('titulo');
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  // 4. Validación de Strings Vacíos en actualización
  it('debería fallar si se intenta actualizar con un string vacío', async () => {
    const dto = plainToInstance(UpdateBlogDto, {
      descripcion: '' // Error: IsNotEmpty heredado
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('descripcion');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });
});