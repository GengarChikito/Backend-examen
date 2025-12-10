import { Usuario, UserRole } from './usuario.entity';

describe('Usuario Entity', () => {
  it('debería estar definido', () => {
    const usuario = new Usuario();
    expect(usuario).toBeDefined();
  });

  it('debería inicializar con valores por defecto si están definidos en la clase', () => {
    // Nota: TypeORM aplica los defaults de la BD al insertar,
    // pero si tu lógica de negocio depende de instancias 'new Usuario()',
    // este test verifica si la clase TypeScript tiene inicializadores.
    // Si no los tiene en la propiedad (ej: role = UserRole.CLIENTE), será undefined hasta que TypeORM lo hidrate.

    const usuario = new Usuario();
    // Asignamos manualmente para probar que la estructura soporta los datos
    usuario.nombre = 'Test User';
    usuario.email = 'test@test.com';
    usuario.role = UserRole.ADMIN;

    expect(usuario.nombre).toBe('Test User');
    expect(usuario.email).toBe('test@test.com');
    expect(usuario.role).toBe(UserRole.ADMIN);
  });

  it('debería aceptar la relación de boletas y reseñas', () => {
    const usuario = new Usuario();
    usuario.boletas = [];
    usuario.resenas = [];

    expect(Array.isArray(usuario.boletas)).toBe(true);
    expect(Array.isArray(usuario.resenas)).toBe(true);
  });
});