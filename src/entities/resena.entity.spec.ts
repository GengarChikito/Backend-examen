import { Resena } from './resena.entity';
import { Usuario } from './usuario.entity';
import { Producto } from './producto.entity';

describe('Resena Entity', () => {
  it('debería estar definido', () => {
    expect(new Resena()).toBeDefined();
  });

  it('debería contener texto, calificación y relaciones', () => {
    const resena = new Resena();
    resena.texto = 'Excelente producto';
    resena.calificacion = 5;
    resena.usuario = new Usuario();
    resena.producto = new Producto();

    expect(resena.texto).toBe('Excelente producto');
    expect(resena.calificacion).toBe(5);
    expect(resena.usuario).toBeInstanceOf(Usuario);
    expect(resena.producto).toBeInstanceOf(Producto);
  });
});
