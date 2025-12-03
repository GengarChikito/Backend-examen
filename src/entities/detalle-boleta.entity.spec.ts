import { DetalleBoleta } from './detalle-boleta.entity';
import { Boleta } from './boleta.entity';
import { Producto } from './producto.entity';

describe('DetalleBoleta Entity', () => {
  it('debería estar definido', () => {
    expect(new DetalleBoleta()).toBeDefined();
  });

  it('debería vincular producto y boleta correctamente', () => {
    const detalle = new DetalleBoleta();
    const producto = new Producto();
    const boleta = new Boleta();

    producto.id = 10;
    boleta.id = 5;

    detalle.producto = producto;
    detalle.boleta = boleta;
    detalle.cantidad = 3;
    detalle.subtotal = 3000;

    expect(detalle.producto.id).toBe(10);
    expect(detalle.boleta.id).toBe(5);
    expect(detalle.cantidad).toBe(3);
    expect(detalle.subtotal).toBe(3000);
  });
});