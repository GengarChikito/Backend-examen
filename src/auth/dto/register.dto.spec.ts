import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('debería validar correctamente un usuario con datos válidos', async () => {
    const dto = plainToInstance(RegisterDto, {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'password123',
      fechaNacimiento: '1995-10-25', // Formato YYYY-MM-DD correcto
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si el email no es válido', async () => {
    const dto = plainToInstance(RegisterDto, {
      nombre: 'Juan',
      email: 'juan-no-es-correo', // Email inválido
      password: 'pass',
      fechaNacimiento: '1990-01-01',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const emailError = errors.find((e) => e.property === 'email');
    expect(emailError).toBeDefined();
  });

  it('debería fallar si la contraseña es muy corta', async () => {
    const dto = plainToInstance(RegisterDto, {
      nombre: 'Juan',
      email: 'juan@example.com',
      password: '123', // Menos de 6 caracteres
      fechaNacimiento: '1990-01-01',
    });

    const errors = await validate(dto);
    const passError = errors.find((e) => e.property === 'password');
    expect(passError).toBeDefined();
    // @ts-ignore
    expect(passError.constraints).toHaveProperty('minLength');
  });

  it('debería fallar si la fecha no es formato ISO 8601', async () => {
    const dto = plainToInstance(RegisterDto, {
      nombre: 'Juan',
      email: 'juan@example.com',
      password: 'password123',
      fechaNacimiento: '25-10-1995',
    });

    const errors = await validate(dto);
    const dateError = errors.find((e) => e.property === 'fechaNacimiento');
    expect(dateError).toBeDefined();
  });
  it('debería aceptar campos opcionales si son del tipo correcto', async () => {
    const dto = plainToInstance(RegisterDto, {
      nombre: 'Juan',
      email: 'juan@example.com',
      password: 'password123',
      fechaNacimiento: '1995-10-25',
      role: 'vendedor',
      puntosLevelUp: 100,
      miCodigoReferido: 'CODIGO1',
      codigoReferidoUsado: 'REF123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si un campo opcional tiene el tipo incorrecto', async () => {
    const dto = plainToInstance(RegisterDto, {
      nombre: 'Juan',
      email: 'juan@example.com',
      password: 'password123',
      fechaNacimiento: '1995-10-25',
      puntosLevelUp: 'mil puntos', // Debería ser number
    });

    const errors = await validate(dto);
    const puntosError = errors.find((e) => e.property === 'puntosLevelUp');
    expect(puntosError).toBeDefined();
  });
});
