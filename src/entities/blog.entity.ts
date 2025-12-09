import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  categoria: string; // Ej: "Guías", "Esports"

  @Column('text')
  descripcion: string;

  @Column()
  fecha: string; // Ej: "8 Septiembre, 2025"

  @Column()
  icono: string; // Ej: "🎮" o "🏆"
}