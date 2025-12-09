import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BoletasModule } from './boletas/boletas.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SeedModule } from './seed/seed.module';
import { ResenasModule } from './resenas/resenas.module';
import { Usuario } from './entities/usuario.entity';
import { Producto } from './entities/producto.entity';
import { Boleta } from './entities/boleta.entity';
import { DetalleBoleta } from './entities/detalle-boleta.entity';
import { Resena } from './entities/resena.entity';
import { EventosModule } from './eventos/eventos.module'; // Importar módulo
import { Evento } from './entities/evento.entity';
import { BlogsModule } from './blogs/blogs.module';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'examen_db',
      entities: [Usuario, Producto, Boleta, DetalleBoleta, Resena, Evento, Blog],
      synchronize: true,
      dropSchema: false,
    }),
    AuthModule,
    BoletasModule,
    ProductosModule,
    UsuariosModule,
    SeedModule,
    ResenasModule,
    EventosModule,
    BlogsModule,
  ],
})
export class AppModule {}