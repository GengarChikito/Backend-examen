import { validate } from 'class-validator';
import { LoginDto } from './login.dto';
import { RegisterDto } from './register.dto';

describe('Auth DTOs', () => {

  describe('LoginDto', () => {
    it('debería pasar con datos válidos', async () => {
      const dto = new LoginDto();
      dto.email = 'test@test.com';
      dto.password = '1234';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('debería fallar con email inválido', async () => {
      const dto = new LoginDto();
      dto.email = 'no-es-email';
      dto.password = '1234';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('RegisterDto', () => {
    it('debería fallar si falta el nombre', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@test.com';
      dto.password = '1234';
      // No asignamos nombre
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});