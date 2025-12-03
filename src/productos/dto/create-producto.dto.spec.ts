import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductoDto } from './create-producto.dto';

describe('CreateProductoDto', () => {
  it('debería validar correctamente un producto válido', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      nombre: 'Nintendo Switch',
      precio: 300000,
      stock: 10,
      imagen: 'https://img.com/foto.jpg',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si el precio es negativo', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      nombre: 'Producto Malo',
      precio: -500, // Error: debe ser positivo
      stock: 10,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('precio');
  });

  it('debería fallar si el stock no es un entero', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      nombre: 'Producto Decimal',
      precio: 1000,
      stock: 5.5, // Error: debe ser entero
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('stock');
  });
});