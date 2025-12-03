import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Boleta } from './boleta.entity';

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
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENTE })
  role: UserRole;
  @OneToMany(() => Boleta, (b) => b.usuario) boletas: Boleta[];
}
