import { Producto } from './producto.entity';

describe('Producto Entity', () => {
  it('debería estar definido', () => {
    expect(new Producto()).toBeDefined();
  });

  it('debería crear una instancia con valores correctos', () => {
    const producto = new Producto();
    producto.nombre = 'PS5';
    producto.precio = 500000;
    producto.stock = 10;
    producto.imagen = 'http://img.com/foto.jpg';

    expect(producto.nombre).toBe('PS5');
    expect(producto.precio).toBe(500000);
    expect(producto.stock).toBe(10);
    expect(producto.imagen).toBe('http://img.com/foto.jpg');
  });
});