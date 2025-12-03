import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Módulos
import { AuthModule } from './auth/auth.module';
import { BoletasModule } from './boletas/boletas.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SeedModule } from './seed/seed.module'; // 1. IMPORTAR ESTO

// Entidades
import { Usuario } from './entities/usuario.entity';
import { Producto } from './entities/producto.entity';
import { Boleta } from './entities/boleta.entity';
import { DetalleBoleta } from './entities/detalle-boleta.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234', // Asegúrate de que esta clave sea la correcta de tu MySQL
      database: 'evaluacion_db', // Asegúrate de que esta DB exista
      entities: [Usuario, Producto, Boleta, DetalleBoleta],
      synchronize: true,
      dropSchema: false,
    }),

    AuthModule,
    BoletasModule,
    ProductosModule,
    UsuariosModule,
    SeedModule, // 2. AGREGAR ESTO AQUÍ
  ],
})
export class AppModule {}