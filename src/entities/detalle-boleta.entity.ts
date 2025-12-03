import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Boleta } from './boleta.entity';
import { Producto } from './producto.entity';

@Entity()
export class DetalleBoleta {
  @PrimaryGeneratedColumn() id: number;
  @Column('int') cantidad: number;
  @Column('decimal') subtotal: number;
  @ManyToOne(() => Boleta, (b) => b.detalles) boleta: Boleta;
  @ManyToOne(() => Producto) producto: Producto;
}