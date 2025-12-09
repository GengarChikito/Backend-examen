import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('int')
  puntos: number; // Ej: 100

  @Column()
  ubicacion: string;

  @Column()
  fecha: string; // Ej: "15 de Octubre, 2025"

  @Column()
  hora: string; // Ej: "18:00 - 23:00 hrs"

  @Column('text')
  descripcion: string;
}