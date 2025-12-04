import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { Usuario } from './usuario.entity';
import { DetalleBoleta } from './detalle-boleta.entity';

@Entity()
export class Boleta {
  @PrimaryGeneratedColumn() id: number;
  @CreateDateColumn() fecha: Date;
  @Column('decimal', { default: 0 }) total: number;
  @Column({ default: 'EFECTIVO' }) metodoPago: string;

  @Column('decimal', { default: 0 })
  descuentoAplicado: number;

  @ManyToOne(() => Usuario, (u) => u.boletas) usuario: Usuario;
  @OneToMany(() => DetalleBoleta, (d) => d.boleta, { cascade: true }) detalles: DetalleBoleta[];
}