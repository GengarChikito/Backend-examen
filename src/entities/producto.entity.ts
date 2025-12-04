import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Resena } from './resena.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  categoria: string;

  @Column('text')
  descripcion: string;

  @Column('decimal')
  precio: number;

  @Column('int')
  stock: number;

  @Column({ type: 'text', nullable: true })
  imagen: string;

  @OneToMany(() => Resena, (r) => r.producto)
  resenas: Resena[];
}