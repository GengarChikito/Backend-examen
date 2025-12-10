import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateBlogDto } from './create-blog.dto';

describe('CreateBlogDto', () => {
  // 1. Caso Exitoso
  it('debería validar correctamente un blog con todos los campos', async () => {
    const dto = plainToInstance(CreateBlogDto, {
      titulo: 'Cómo armar tu PC',
      categoria: 'Guías',
      descripcion: 'Contenido extenso del artículo...',
      fecha: '10 Octubre, 2025',
      icono: '🎮',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  // 2. Validación de Campos Vacíos o Faltantes
  it('debería fallar si faltan campos requeridos', async () => {
    const dto = plainToInstance(CreateBlogDto, {
      // Falta título
      categoria: 'Guías',
      // Falta descripción
      fecha: '10 Octubre, 2025',
      icono: '🎮',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    // Verificamos que los errores sean de las propiedades faltantes
    const propiedadesConError = errors.map(e => e.property);
    expect(propiedadesConError).toContain('titulo');
    expect(propiedadesConError).toContain('descripcion');
  });

  // 3. Validación de Tipos
  it('debería fallar si los tipos de datos son incorrectos', async () => {
    const dto = plainToInstance(CreateBlogDto, {
      titulo: 12345, // Error: Debería ser string
      categoria: true, // Error: Debería ser string
      descripcion: 'Texto válido',
      fecha: '10 Octubre, 2025',
      icono: '🎮',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const tituloError = errors.find(e => e.property === 'titulo');
    expect(tituloError?.constraints).toHaveProperty('isString');
  });

  // 4. Validación de Strings Vacíos
  it('debería fallar si se envían strings vacíos', async () => {
    const dto = plainToInstance(CreateBlogDto, {
      titulo: '', // Error: IsNotEmpty
      categoria: 'Guías',
      descripcion: 'Desc',
      fecha: 'Fecha',
      icono: 'Icono'
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const tituloError = errors.find(e => e.property === 'titulo');
    expect(tituloError?.constraints).toHaveProperty('isNotEmpty');
  });
});