import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Boleta } from './boleta.entity';
import { Resena } from './resena.entity';

export enum UserRole {
  ADMIN = 'admin',
  VENDEDOR = 'vendedor',
  CLIENTE = 'cliente',
}

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn() id: number;
  @Column() nombre: string;
  @Column({ unique: true }) email: string;
  @Column() password: string;

  @Column({ type: 'date' })
  fechaNacimiento: Date;

  @Column({ default: false })
  esEstudianteDuoc: boolean;

  @Column({ default: 0 })
  puntosLevelUp: number;

  @Column({ unique: true })
  miCodigoReferido: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENTE })
  role: UserRole;

  @OneToMany(() => Boleta, (b) => b.usuario) boletas: Boleta[];
  @OneToMany(() => Resena, (r) => r.usuario) resenas: Resena[];
}