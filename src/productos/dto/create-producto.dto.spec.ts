import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductoDto } from './create-producto.dto';

describe('CreateProductoDto', () => {
  // 1. Caso de Éxito
  it('debería validar correctamente un producto con todos los datos', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      nombre: 'Nintendo Switch',
      categoria: 'Consolas',
      descripcion: 'Consola híbrida',
      precio: 300000,
      stock: 15,
      imagen: 'https://img.com/switch.jpg', // Opcional pero válido
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  // 2. Campos Requeridos
  it('debería fallar si faltan campos obligatorios', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      // Falta nombre, categoría y descripción
      precio: 5000,
      stock: 1,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    // Verificamos propiedades específicas
    const propiedadesConError = errors.map((e) => e.property);
    expect(propiedadesConError).toContain('nombre');
    expect(propiedadesConError).toContain('categoria');
    expect(propiedadesConError).toContain('descripcion');
  });

  // 3. Reglas de Negocio (Números)
  it('debería fallar si el precio es negativo o 0 (IsPositive)', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      nombre: 'Producto Gratis',
      categoria: 'Test',
      descripcion: '...',
      precio: 0, // Error: debe ser positivo
      stock: 10,
    });

    const errors = await validate(dto);
    const precioError = errors.find((e) => e.property === 'precio');
    expect(precioError).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(precioError.constraints).toHaveProperty('isPositive');
  });

  it('debería fallar si el stock es negativo (Min 0)', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      nombre: 'Producto',
      categoria: 'Test',
      descripcion: '...',
      precio: 100,
      stock: -1, // Error: mínimo 0
    });

    const errors = await validate(dto);
    const stockError = errors.find((e) => e.property === 'stock');
    expect(stockError).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(stockError.constraints).toHaveProperty('min');
  });

  it('debería fallar si el stock es decimal (IsInt)', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      nombre: 'Producto',
      categoria: 'Test',
      descripcion: '...',
      precio: 100,
      stock: 5.5, // Error: debe ser entero
    });

    const errors = await validate(dto);
    const stockError = errors.find((e) => e.property === 'stock');
    expect(stockError).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(stockError.constraints).toHaveProperty('isInt');
  });

  // 4. Tipos de Datos
  it('debería fallar si los tipos son incorrectos', async () => {
    const dto = plainToInstance(CreateProductoDto, {
      nombre: 12345, // Debería ser string
      categoria: true, // Debería ser string
      precio: 'mil pesos', // Debería ser number
      stock: 'diez', // Debería ser number
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
