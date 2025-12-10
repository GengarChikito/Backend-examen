import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {

  it('debería validar credenciales correctas', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'admin@tienda.cl',
      password: '123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si el email es inválido', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'no-soy-un-correo',
      password: '123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('debería fallar si falta la contraseña', async () => {
    const dto = plainToInstance(LoginDto, {
      email: 'admin@tienda.cl',
      // password faltante
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
});