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

  // 1. Helper para calcular descuento por nivel (Gamificación)
  private getLevelDiscount(puntos: number): number {
    if (puntos >= 8000) return 0.25; // 25% Master Gamer
    if (puntos >= 4000) return 0.22; // 22% Gaming Legend
    if (puntos >= 2000) return 0.18; // 18% Elite Player
    if (puntos >= 1000) return 0.15; // 15% Pro Gamer
    if (puntos >= 500) return 0.12;  // 12% Dedicated Gamer
    if (puntos >= 250) return 0.08;  // 8%  Gaming Enthusiast
    if (puntos >= 100) return 0.05;  // 5%  Casual Player
    return 0;                        // 0%  Rookie
  }

  async create(dto: CreateBoletaDto, usuarioPayload: any) {
    const usuario = await this.usuarioRepo.findOneBy({ id: usuarioPayload.id });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const nuevaBoleta = new Boleta();
    nuevaBoleta.usuario = usuario;
    nuevaBoleta.metodoPago = dto.metodoPago || 'EFECTIVO';
    nuevaBoleta.detalles = [];

    let subtotalAcumulado = 0;

    // Procesar productos y calcular subtotal bruto
    for (const item of dto.detalles) {
      const producto = await this.prodRepo.findOneBy({ id: item.productoId });
      if (!producto) throw new NotFoundException(`Producto ${item.productoId} no existe`);
      if (producto.stock < item.cantidad) throw new BadRequestException(`Sin stock para ${producto.nombre}`);

      const detalle = new DetalleBoleta();
      detalle.producto = producto;
      detalle.cantidad = item.cantidad;
      detalle.subtotal = producto.precio * item.cantidad;

      nuevaBoleta.detalles.push(detalle);
      subtotalAcumulado += detalle.subtotal;

      // Actualizar Stock
      producto.stock -= item.cantidad;
      await this.prodRepo.save(producto);
    }

    // 2. Lógica de Descuentos (Se aplica el mejor descuento disponible)
    let descuentoPorcentaje = 0;

    // A. Descuento DUOC (20%)
    if (usuario.esEstudianteDuoc) {
      descuentoPorcentaje = 0.20;
    }

    // B. Descuento por Nivel (Gamificación)
    const descuentoNivel = this.getLevelDiscount(usuario.puntosLevelUp);

    // Aplicamos el mayor de los dos descuentos
    if (descuentoNivel > descuentoPorcentaje) {
      descuentoPorcentaje = descuentoNivel;
    }

    // Aplicar descuento
    nuevaBoleta.descuentoAplicado = Math.round(subtotalAcumulado * descuentoPorcentaje);

    // Calcular Total Final
    nuevaBoleta.total = subtotalAcumulado - nuevaBoleta.descuentoAplicado;

    // Sumar nuevos Puntos LevelUp (5% del total pagado)
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