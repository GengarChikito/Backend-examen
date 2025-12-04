import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resena } from '../entities/resena.entity';
import { Producto } from '../entities/producto.entity';
import { CreateResenaDto } from './dto/create-resena.dto';

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

  async findByProduct(productoId: number) {
    return this.resenaRepo.find({
      where: { producto: { id: productoId } },
      relations: ['usuario'],
      order: { fecha: 'DESC' }
    });
  }

  // 1. NUEVO MÉTODO AGREGADO
  async findAll() {
    return this.resenaRepo.find({
      relations: ['usuario', 'producto'], // Traemos quién escribió y de qué producto
      order: { fecha: 'DESC' }
    });
  }
}