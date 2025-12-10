import { Boleta } from './boleta.entity';
import { Usuario } from './usuario.entity';

describe('Boleta Entity', () => {
  it('debería estar definido', () => {
    expect(new Boleta()).toBeDefined();
  });

  it('debería tener las relaciones definidas', () => {
    const boleta = new Boleta();
    const usuario = new Usuario();
    usuario.id = 1;

    boleta.usuario = usuario;
    boleta.detalles = [];

    expect(boleta.usuario).toBeDefined();
    expect(boleta.usuario.id).toBe(1);
    expect(Array.isArray(boleta.detalles)).toBe(true);
  });

  it('debería permitir asignar totales y descuentos', () => {
    const boleta = new Boleta();
    boleta.total = 10000;
    boleta.descuentoAplicado = 2000;
    boleta.metodoPago = 'TARJETA';

    expect(boleta.total).toBe(10000);
    expect(boleta.descuentoAplicado).toBe(2000);
    expect(boleta.metodoPago).toBe('TARJETA');
  });
});