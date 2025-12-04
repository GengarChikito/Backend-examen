import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Producto } from './producto.entity';

@Entity()
export class Resena {
  @PrimaryGeneratedColumn() id: number;
  @Column() texto: string;
  @Column('int') calificacion: number;
  @CreateDateColumn() fecha: Date;

  @ManyToOne(() => Usuario, (u) => u.resenas) usuario: Usuario;
  @ManyToOne(() => Producto, (p) => p.resenas) producto: Producto;
}