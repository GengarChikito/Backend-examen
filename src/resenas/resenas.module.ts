import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenasService } from './resenas.service';
import { ResenasController } from './resenas.controller';
import { Resena } from '../entities/resena.entity';
import { Producto } from '../entities/producto.entity';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Resena, Producto, Usuario])],
  controllers: [ResenasController],
  providers: [ResenasService],
})
export class ResenasModule {}