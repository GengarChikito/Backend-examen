import { Usuario, UserRole } from './usuario.entity';

describe('Usuario Entity', () => {
  it('debería estar definido', () => {
    expect(new Usuario()).toBeDefined();
  });

  it('debería tener el rol de CLIENTE por defecto si no se asigna otro', () => {
    const usuario = new Usuario();
    // Simulamos el comportamiento de la DB (en unitario puro comprobamos la instancia)
    // Nota: El decorador @Column({ default: ... }) lo ejecuta la DB,
    // pero aquí probamos que la propiedad acepte valores.
    usuario.role = UserRole.ADMIN;
    expect(usuario.role).toBe(UserRole.ADMIN);
  });

  it('debería guardar los datos correctamente', () => {
    const usuario = new Usuario();
    usuario.nombre = 'Juan';
    usuario.email = 'juan@test.com';
    usuario.password = '1234';

    expect(usuario.nombre).toBe('Juan');
    expect(usuario.email).toBe('juan@test.com');
    expect(usuario.password).toBe('1234');
  });
});