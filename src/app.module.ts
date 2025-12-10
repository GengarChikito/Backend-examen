import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// ... otros módulos
import { AuthModule } from './auth/auth.module';
import { BoletasModule } from './boletas/boletas.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SeedModule } from './seed/seed.module';
import { ResenasModule } from './resenas/resenas.module';
import { EventosModule } from './eventos/eventos.module';
import { BlogsModule } from './blogs/blogs.module';

// Entidades
import { Usuario } from './entities/usuario.entity';
import { Producto } from './entities/producto.entity';
import { Boleta } from './entities/boleta.entity';
import { DetalleBoleta } from './entities/detalle-boleta.entity';
import { Resena } from './entities/resena.entity';
import { Evento } from './entities/evento.entity';
import { Blog } from './entities/blog.entity';

@Module({
  imports: [
    // 1. Configuración Global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Base de Datos Asíncrona
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // CORRECCIÓN ROBUSTA: Se extraen los valores asegurando que nunca sean undefined.
        // Si no existe la variable en .env, usa el valor por defecto ('3306', 'localhost', etc.)
        const port = configService.get<string>('DB_PORT') || '3306';
        const host = configService.get<string>('DB_HOST') || 'localhost';
        const username = configService.get<string>('DB_USERNAME') || 'root';
        const password = configService.get<string>('DB_PASSWORD') || '1234';
        const database = configService.get<string>('DB_NAME') || 'examen_db';

        return {
          type: 'mysql',
          host: host,
          port: parseInt(port, 10), // Usamos la variable 'port' que ya es un string
          username: username,
          password: password,
          database: database,
          entities: [
            Usuario,
            Producto,
            Boleta,
            DetalleBoleta,
            Resena,
            Evento,
            Blog,
          ],
          synchronize: true,
          dropSchema: false,
        };
      },
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