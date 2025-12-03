import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from '../entities/producto.entity';

@Module({
  imports: [
    // Registramos la entidad Producto para poder inyectar el Repository en el Service
    TypeOrmModule.forFeature([Producto]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  // Exportamos el servicio por si el módulo de Boletas necesita validar stock de productos
  exports: [ProductosService],
})
export class ProductosModule {}