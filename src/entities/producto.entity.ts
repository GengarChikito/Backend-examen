import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal')
  precio: number;

  @Column('int')
  stock: number;

  // NUEVA COLUMNA PARA LA FOTO (Puede ser nula por si acaso)
  @Column({ type: 'text', nullable: true })
  imagen: string;
}