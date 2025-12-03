import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Usuario } from '../entities/usuario.entity';
import { Producto } from '../entities/producto.entity';

@Module({
  // Importamos las entidades para poder usarlas en el servicio
  imports: [TypeOrmModule.forFeature([Usuario, Producto])],
  providers: [SeedService],
})
export class SeedModule {}