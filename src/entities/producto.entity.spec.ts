import { Producto } from './producto.entity';

describe('Producto Entity', () => {
  it('debería estar definido', () => {
    expect(new Producto()).toBeDefined();
  });

  it('debería permitir asignar propiedades básicas', () => {
    const producto = new Producto();
    producto.nombre = 'PlayStation 5';
    producto.precio = 500000;
    producto.stock = 10;
    producto.categoria = 'Consolas';

    expect(producto.nombre).toBe('PlayStation 5');
    expect(producto.precio).toBe(500000);
    expect(producto.stock).toBe(10);
    expect(producto.categoria).toBe('Consolas');
  });
});