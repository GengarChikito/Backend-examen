import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from '../entities/resena.entity';
import { Producto } from '../entities/producto.entity';
import { CreateResenaDto } from './dto/create-resena.dto';
import { UpdateResenaDto } from './dto/update-resena.dto';
import { UserRole } from '../entities/usuario.entity';

@Injectable()
export class ResenasService {
  constructor(
    @InjectRepository(Resena) private resenaRepo: Repository<Resena>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateResenaDto, usuario: any) {
    const producto = await this.productoRepo.findOneBy({ id: dto.productoId });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    const resena = this.resenaRepo.create({
      ...dto,
      producto,
      usuario
    });
    return this.resenaRepo.save(resena);
  }

  async findAll() {
    return this.resenaRepo.find({
      relations: ['usuario', 'producto'],
      order: { fecha: 'DESC' }
    });
  }

  async findByProduct(productoId: number) {
    return this.resenaRepo.find({
      where: { producto: { id: productoId } },
      relations: ['usuario'],
      order: { fecha: 'DESC' }
    });
  }

  // --- NUEVOS MÉTODOS ---

  async update(id: number, dto: UpdateResenaDto, user: any) {
    const resena = await this.resenaRepo.findOne({
      where: { id },
      relations: ['usuario']
    });

    if (!resena) throw new NotFoundException('Reseña no encontrada');

    // Validación: Solo el dueño puede editar su reseña
    if (resena.usuario.id !== user.id) {
      throw new ForbiddenException('No puedes editar una reseña que no es tuya');
    }

    // Actualizamos solo campos permitidos
    if (dto.texto) resena.texto = dto.texto;
    if (dto.calificacion) resena.calificacion = dto.calificacion;

    return this.resenaRepo.save(resena);
  }

  async remove(id: number, user: any) {
    const resena = await this.resenaRepo.findOne({
      where: { id },
      relations: ['usuario']
    });

    if (!resena) throw new NotFoundException('Reseña no encontrada');

    // Validación: Puede borrar el dueño O un administrador
    const esDueno = resena.usuario.id === user.id;
    const esAdmin = user.role === UserRole.ADMIN;

    if (!esDueno && !esAdmin) {
      throw new ForbiddenException('No tienes permiso para eliminar esta reseña');
    }

    await this.resenaRepo.remove(resena);
    return { message: 'Reseña eliminada correctamente' };
  }
}