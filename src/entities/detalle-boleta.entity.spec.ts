import { DetalleBoleta } from './detalle-boleta.entity';
import { Producto } from './producto.entity';
import { Boleta } from './boleta.entity';

describe('DetalleBoleta Entity', () => {
  it('debería estar definido', () => {
    expect(new DetalleBoleta()).toBeDefined();
  });

  it('debería vincular producto y boleta correctamente', () => {
    const detalle = new DetalleBoleta();
    const producto = new Producto();
    producto.nombre = 'Mouse';
    const boleta = new Boleta();
    boleta.id = 100;

    detalle.producto = producto;
    detalle.boleta = boleta;
    detalle.cantidad = 2;
    detalle.subtotal = 5000;

    expect(detalle.producto.nombre).toBe('Mouse');
    expect(detalle.boleta.id).toBe(100);
    expect(detalle.cantidad).toBe(2);
    expect(detalle.subtotal).toBe(5000);
  });
});