import { Roles, ROLES_KEY } from './roles.decorator';
import { UserRole } from '../entities/usuario.entity';

describe('RolesDecorator', () => {
  it('debería definir la metadata de roles correctamente', () => {
    // Simulamos una clase o método donde ponemos el decorador
    class TestClass {
      @Roles(UserRole.ADMIN)
      testMethod() {}
    }

    // Leemos la metadata que el decorador debió haber inyectado
    const metadata = Reflect.getMetadata(ROLES_KEY, TestClass.prototype.testMethod);

    expect(metadata).toEqual([UserRole.ADMIN]);
  });
});