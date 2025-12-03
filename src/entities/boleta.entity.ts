import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  Column,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { DetalleBoleta } from './detalle-boleta.entity';

@Entity()
export class Boleta {
  @PrimaryGeneratedColumn() id: number;

  @CreateDateColumn() fecha: Date;

  @Column('decimal', { default: 0 }) total: number;

  // 1. NUEVA COLUMNA
  @Column({ default: 'EFECTIVO' })
  metodoPago: string;

  @ManyToOne(() => Usuario, (u) => u.boletas) usuario: Usuario;

  @OneToMany(() => DetalleBoleta, (d) => d.boleta, { cascade: true })
  detalles: DetalleBoleta[];
}