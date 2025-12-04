import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletasService } from './boletas.service';
import { BoletasController } from './boletas.controller';
import { Boleta } from '../entities/boleta.entity';
import { DetalleBoleta } from '../entities/detalle-boleta.entity';
import { Producto } from '../entities/producto.entity';
import { Usuario } from '../entities/usuario.entity'; // 1. IMPORTAR ESTO

@Module({
  imports: [
    // 2. AGREGAR 'Usuario' AL ARRAY
    TypeOrmModule.forFeature([Boleta, DetalleBoleta, Producto, Usuario]),
  ],
  controllers: [BoletasController],
  providers: [BoletasService],
})
export class BoletasModule {}