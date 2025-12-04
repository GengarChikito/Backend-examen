import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Boleta } from '../entities/boleta.entity';
import { Producto } from '../entities/producto.entity';
import { DetalleBoleta } from '../entities/detalle-boleta.entity';
import { CreateBoletaDto } from './dto/create-boleta.dto';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class BoletasService {
  constructor(
    @InjectRepository(Boleta) private boletaRepo: Repository<Boleta>,
    @InjectRepository(Producto) private prodRepo: Repository<Producto>,
    @InjectRepository(Usuario) private usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateBoletaDto, usuarioPayload: any) {
    const usuario = await this.usuarioRepo.findOneBy({ id: usuarioPayload.id });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const nuevaBoleta = new Boleta();
    nuevaBoleta.usuario = usuario;
    nuevaBoleta.metodoPago = dto.metodoPago || 'EFECTIVO';
    nuevaBoleta.detalles = [];

    let subtotal = 0;

    for (const item of dto.detalles) {
      const producto = await this.prodRepo.findOneBy({ id: item.productoId });
      if (!producto) throw new NotFoundException(`Producto ${item.productoId} no existe`);
      if (producto.stock < item.cantidad) throw new BadRequestException(`Sin stock para ${producto.nombre}`);

      const detalle = new DetalleBoleta();
      detalle.producto = producto;
      detalle.cantidad = item.cantidad;
      detalle.subtotal = producto.precio * item.cantidad;

      nuevaBoleta.detalles.push(detalle);
      subtotal += detalle.subtotal;

      producto.stock -= item.cantidad;
      await this.prodRepo.save(producto);
    }

    if (usuario.esEstudianteDuoc) {
      nuevaBoleta.descuentoAplicado = subtotal * 0.20;
      nuevaBoleta.total = subtotal - nuevaBoleta.descuentoAplicado;
    } else {
      nuevaBoleta.descuentoAplicado = 0;
      nuevaBoleta.total = subtotal;
    }

    const puntosGanados = Math.floor(nuevaBoleta.total * 0.05);
    usuario.puntosLevelUp += puntosGanados;
    await this.usuarioRepo.save(usuario);

    return this.boletaRepo.save(nuevaBoleta);
  }

  findAll() {
    return this.boletaRepo.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }

  findDaily() {
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);
    const finHoy = new Date();
    finHoy.setHours(23, 59, 59, 999);

    return this.boletaRepo.find({
      where: { fecha: Between(inicioHoy, finHoy) },
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }
}