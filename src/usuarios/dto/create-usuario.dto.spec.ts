import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UserRole } from '../../entities/usuario.entity';

describe('CreateUsuarioDto', () => {
  it('debería validar un usuario correcto', async () => {
    const dto = plainToInstance(CreateUsuarioDto, {
      nombre: 'Pepe',
      email: 'pepe@mail.com',
      password: 'password123',
      fechaNacimiento: '1990-05-20',
      role: UserRole.CLIENTE,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('debería fallar si el email no es válido', async () => {
    const dto = plainToInstance(CreateUsuarioDto, {
      nombre: 'Pepe',
      email: 'no-email',
      password: '123',
      fechaNacimiento: '1990-05-20',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('debería fallar si el rol es inválido', async () => {
    const dto = plainToInstance(CreateUsuarioDto, {
      nombre: 'Pepe',
      email: 'pepe@mail.com',
      password: '123',
      fechaNacimiento: '1990-05-20',
      role: 'SUPER_DIOS', // Rol inexistente
    } as any); // Cast any para forzar el error

    const errors = await validate(dto);
    const roleError = errors.find((e) => e.property === 'role');
    expect(roleError).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(roleError.constraints).toHaveProperty('isEnum');
  });
});
