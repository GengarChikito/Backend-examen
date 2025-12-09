import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';

// Entidades
import { Usuario } from '../entities/usuario.entity';
import { Producto } from '../entities/producto.entity';
import { Evento } from '../entities/evento.entity';
import { Blog } from '../entities/blog.entity';

@Module({
  imports: [
    // Registramos TODAS las entidades que usa el SeedService
    TypeOrmModule.forFeature([Usuario, Producto, Evento, Blog]),
  ],
  providers: [SeedService],
})
export class SeedModule {}