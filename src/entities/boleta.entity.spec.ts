import { Boleta } from './boleta.entity';
import { Usuario } from './usuario.entity';

describe('Boleta Entity', () => {
  it('debería estar definido', () => {
    expect(new Boleta()).toBeDefined();
  });

  it('debería aceptar un usuario y detalles', () => {
    const boleta = new Boleta();
    const usuario = new Usuario();
    usuario.id = 1;

    boleta.usuario = usuario;
    boleta.total = 1000;
    boleta.metodoPago = 'TARJETA';
    boleta.fecha = new Date();

    expect(boleta.usuario).toBe(usuario);
    expect(boleta.total).toBe(1000);
    expect(boleta.metodoPago).toBe('TARJETA');
    expect(boleta.fecha).toBeInstanceOf(Date);
  });
});