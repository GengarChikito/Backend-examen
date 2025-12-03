import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// 1. Importante: Agregamos 'Between' aquí
import { Repository, Between } from 'typeorm';
import { Boleta } from '../entities/boleta.entity';
import { Producto } from '../entities/producto.entity';
import { DetalleBoleta } from '../entities/detalle-boleta.entity';
import { CreateBoletaDto } from './dto/create-boleta.dto';

@Injectable()
export class BoletasService {
  constructor(
    @InjectRepository(Boleta) private boletaRepo: Repository<Boleta>,
    @InjectRepository(Producto) private prodRepo: Repository<Producto>,
  ) {}

  async create(dto: CreateBoletaDto, usuario: any) {
    const nuevaBoleta = new Boleta();
    nuevaBoleta.usuario = usuario; // Usuario que viene del Token

    // 2. Guardamos el método de pago que viene del Frontend
    // Si no viene nada, por defecto la entidad pondrá 'EFECTIVO'
    nuevaBoleta.metodoPago = dto.metodoPago || 'EFECTIVO';

    nuevaBoleta.detalles = [];
    let total = 0;

    // Recorremos los productos del carrito
    for (const item of dto.detalles) {
      const producto = await this.prodRepo.findOneBy({ id: item.productoId });

      if (!producto)
        throw new NotFoundException(`Producto ${item.productoId} no existe`);

      if (producto.stock < item.cantidad)
        throw new BadRequestException(`Sin stock para ${producto.nombre}`);

      // Creamos el detalle
      const detalle = new DetalleBoleta();
      detalle.producto = producto;
      detalle.cantidad = item.cantidad;
      detalle.subtotal = producto.precio * item.cantidad;

      nuevaBoleta.detalles.push(detalle);
      total += detalle.subtotal;

      // Descontamos el stock
      producto.stock -= item.cantidad;
      await this.prodRepo.save(producto);
    }

    nuevaBoleta.total = total;
    return this.boletaRepo.save(nuevaBoleta);
  }

  // Obtener TODAS las boletas (Historial completo)
  findAll() {
    return this.boletaRepo.find({
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' }, // Las más nuevas primero
    });
  }

  // 3. Obtener SOLO las boletas de HOY (Reporte Diario)
  findDaily() {
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);

    const finHoy = new Date();
    finHoy.setHours(23, 59, 59, 999);

    return this.boletaRepo.find({
      where: {
        fecha: Between(inicioHoy, finHoy),
      },
      relations: ['usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' },
    });
  }
}