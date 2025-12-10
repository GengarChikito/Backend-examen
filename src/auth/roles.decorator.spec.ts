import { Roles, ROLES_KEY } from './roles.decorator';
import { UserRole } from '../entities/usuario.entity';

describe('RolesDecorator', () => {
  it('debería tener definida la clave de metadata correcta', () => {
    expect(ROLES_KEY).toBe('roles');
  });

  it('debería establecer la metadata de roles en un método', () => {
    const roles = [UserRole.ADMIN, UserRole.VENDEDOR];


    class TestClass {
      @Roles(...roles)
      testMethod() {}
    }

    const metadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.testMethod);

    expect(metadata).toEqual(roles);
  });

  it('debería establecer la metadata de roles en una clase', () => {
    const roles = [UserRole.CLIENTE];

    @Roles(...roles)
    class TestClass {}

    const metadata = Reflect.getMetadata(ROLES_KEY, TestClass);

    expect(metadata).toEqual(roles);
  });
});