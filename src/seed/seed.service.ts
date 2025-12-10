import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Entidades
import { Usuario, UserRole } from '../entities/usuario.entity';
import { Producto } from '../entities/producto.entity';
import { Evento } from '../entities/evento.entity';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario) private readonly userRepo: Repository<Usuario>,
    @InjectRepository(Producto) private readonly productRepo: Repository<Producto>,
    @InjectRepository(Evento) private readonly eventRepo: Repository<Evento>,
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
  ) {}

  // --- CICLO DE VIDA ---
  async onModuleInit() {
    await this.insertarUsuarios();
    await this.insertarProductos();
    await this.insertarEventos();
    await this.insertarBlogs();
  }

  // --- MÉTODOS DE SEMBRADO ---

  private async insertarUsuarios() {
    const total = await this.userRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Usuarios...');
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('123', salt); // Contraseña general para seeds

    const usuarios = [
      {
        nombre: 'Super Admin',
        email: 'admin@tienda.cl',
        password,
        role: UserRole.ADMIN,
        fechaNacimiento: '1990-01-01',
        miCodigoReferido: 'ADMIN01',
      },
      {
        nombre: 'Juan Duoc',
        email: 'juan@duoc.cl',
        password,
        role: UserRole.CLIENTE,
        esEstudianteDuoc: true,
        fechaNacimiento: '2000-05-15',
        miCodigoReferido: 'JUAN01',
      },
      // --- NUEVO USUARIO INVITADO ---
      {
        nombre: 'Invitado',
        email: 'invitado@levelup.com',
        password, // Usa la misma contraseña '123'
        role: UserRole.CLIENTE,
        esEstudianteDuoc: false,
        fechaNacimiento: '2000-01-01',
        miCodigoReferido: 'GUEST00',
      },
    ];

    for (const u of usuarios) {
      await this.userRepo.save(this.userRepo.create(u as any));
    }
  }

  private async insertarProductos() {
    const total = await this.productRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Catálogo Completo...');

    const productos = [
      {
        nombre: 'Catan',
        categoria: 'Juegos de Mesa',
        descripcion: 'El clásico juego de estrategia y comercio.',
        precio: 29990,
        stock: 20,
        imagen:
          'https://th.bing.com/th/id/R.c2757efde068184f9e51c519b4eb1d00?rik=9El8kEc9ZYLdvg&pid=ImgRaw&r=0',
      },
      {
        nombre: 'Carcassonne',
        categoria: 'Juegos de Mesa',
        descripcion: 'Juego de colocación de losetas y estrategia medieval.',
        precio: 24990,
        stock: 15,
        imagen:
          'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'Controlador Xbox Series X',
        categoria: 'Accesorios',
        descripcion: 'Mando inalámbrico con agarre texturizado.',
        precio: 59990,
        stock: 10,
        imagen:
          'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'Audífonos HyperX Cloud II',
        categoria: 'Accesorios',
        descripcion: 'Sonido envolvente 7.1 para gaming profesional.',
        precio: 79990,
        stock: 12,
        imagen:
          'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'PlayStation 5',
        categoria: 'Consolas',
        descripcion: 'Consola de última generación con SSD ultrarrápido.',
        precio: 549990,
        stock: 5,
        imagen:
          'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'PC Gamer ASUS ROG Strix',
        categoria: 'Computadores Gamers',
        descripcion: 'Potencia extrema para los juegos más exigentes.',
        precio: 1299990,
        stock: 3,
        imagen:
          'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'Silla Gamer Secretlab Titan',
        categoria: 'Sillas Gamers',
        descripcion: 'Comodidad y ergonomía para largas sesiones.',
        precio: 349990,
        stock: 7,
        imagen:
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'Mouse Logitech G502 HERO',
        categoria: 'Mouse',
        descripcion: 'Sensor óptico avanzado para máxima precisión.',
        precio: 49990,
        stock: 25,
        imagen:
          'https://images.unsplash.com/photo-1615663245857-acda5b2b15d5?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'Mousepad Razer Goliathus',
        categoria: 'Mousepad',
        descripcion: 'Superficie de tela texturizada para velocidad.',
        precio: 29990,
        stock: 30,
        imagen:
          'https://images.unsplash.com/photo-1629377750731-9a74421b53f6?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'Polera Gamer Level-Up',
        categoria: 'Poleras Personalizadas',
        descripcion: 'Estilo único para verdaderos gamers.',
        precio: 14990,
        stock: 50,
        imagen:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      },
      {
        nombre: 'Polerón Gamer Pro',
        categoria: 'Polerones Gamers Personalizados',
        descripcion: 'Polerón con capucha y diseño exclusivo de la tienda.',
        precio: 29990,
        stock: 40,
        imagen:
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      },
    ];

    await this.productRepo.save(productos);
  }

  private async insertarEventos() {
    const total = await this.eventRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Eventos...');

    const eventos = [
      {
        titulo: 'LAN Party Santiago',
        puntos: 100,
        ubicacion: 'Santiago Centro',
        fecha: '15 de Octubre, 2025',
        hora: '18:00 - 23:00 hrs',
        descripcion:
          'Únete a la LAN Party más grande de Santiago. Torneos de CS:GO, League of Legends y más.',
      },
      {
        titulo: 'Torneo FIFA Valparaíso',
        puntos: 75,
        ubicacion: 'Viña del Mar',
        fecha: '22 de Octubre, 2025',
        hora: '14:00 - 20:00 hrs',
        descripcion:
          'Competencia de FIFA 2025 con premios increíbles y clasificatoria nacional.',
      },
      {
        titulo: 'Gaming Expo Concepción',
        puntos: 50,
        ubicacion: 'Concepción',
        fecha: '5 de Noviembre, 2025',
        hora: '10:00 - 18:00 hrs',
        descripcion:
          'Exposición de los últimos productos gaming y demostraciones de nuevos juegos.',
      },
    ];

    await this.eventRepo.save(eventos);
  }

  private async insertarBlogs() {
    const total = await this.blogRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Blogs...');

    const blogs = [
      {
        categoria: 'Guías',
        titulo: 'Cómo construir tu PC Gamer perfecto en 2025',
        descripcion:
          'Guía completa para elegir los componentes ideales según tu presupuesto y necesidades gaming.',
        fecha: '8 Septiembre, 2025',
        icono: '🎮',
      },
      {
        categoria: 'Esports',
        titulo: 'Los mejores periféricos para gaming competitivo',
        descripcion:
          'Descubre qué mouse, teclado y auriculares usan los profesionales del esports mundial.',
        fecha: '5 Septiembre, 2025',
        icono: '🏆',
      },
      {
        categoria: 'Setup',
        titulo: 'Setup ergonómico: La silla gamer perfecta',
        descripcion:
          'Todo lo que necesitas saber para mantener tu postura y comodidad durante horas de juego.',
        fecha: '2 Septiembre, 2025',
        icono: '💺',
      },
    ];

    await this.blogRepo.save(blogs);
  }
}