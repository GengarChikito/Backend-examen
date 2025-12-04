import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario, UserRole } from '../entities/usuario.entity';
import { Producto } from '../entities/producto.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Usuario) private readonly userRepo: Repository<Usuario>,
    @InjectRepository(Producto) private readonly productRepo: Repository<Producto>,
  ) {}

  async onModuleInit() {
    await this.insertarUsuarios();
    await this.insertarProductos();
  }

  private async insertarUsuarios() {
    const total = await this.userRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Usuarios...');
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('123', salt);

    const usuarios = [
      {
        nombre: 'Super Admin',
        email: 'admin@tienda.cl',
        password,
        role: UserRole.ADMIN,
        fechaNacimiento: '1990-01-01',
        miCodigoReferido: 'ADMIN01'
      },
      {
        nombre: 'Juan Duoc',
        email: 'juan@duoc.cl',
        password,
        role: UserRole.CLIENTE,
        esEstudianteDuoc: true,
        fechaNacimiento: '2000-05-15',
        miCodigoReferido: 'JUAN01'
      },
    ];

    for (const u of usuarios) {
      await this.userRepo.save(this.userRepo.create(u as any));
    }
  }

  private async insertarProductos() {
    const total = await this.productRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Catálogo Completo (Incluyendo Polerones)...');

    const productos = [
      {
        nombre: 'Catan',
        categoria: 'Juegos de Mesa',
        descripcion: 'El clásico juego de estrategia y comercio.',
        precio: 29990,
        stock: 20,
        imagen: 'https://images.unsplash.com/photo-1609386349942-1e9675271879?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Carcassonne',
        categoria: 'Juegos de Mesa',
        descripcion: 'Juego de colocación de losetas y estrategia medieval.',
        precio: 24990,
        stock: 15,
        imagen: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Controlador Xbox Series X',
        categoria: 'Accesorios',
        descripcion: 'Mando inalámbrico con agarre texturizado.',
        precio: 59990,
        stock: 10,
        imagen: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Audífonos HyperX Cloud II',
        categoria: 'Accesorios',
        descripcion: 'Sonido envolvente 7.1 para gaming profesional.',
        precio: 79990,
        stock: 12,
        imagen: 'https://images.unsplash.com/photo-1612444530582-fc66183b16f7?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'PlayStation 5',
        categoria: 'Consolas',
        descripcion: 'Consola de última generación con SSD ultrarrápido.',
        precio: 549990,
        stock: 5,
        imagen: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'PC Gamer ASUS ROG Strix',
        categoria: 'Computadores Gamers',
        descripcion: 'Potencia extrema para los juegos más exigentes.',
        precio: 1299990,
        stock: 3,
        imagen: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Silla Gamer Secretlab Titan',
        categoria: 'Sillas Gamers',
        descripcion: 'Comodidad y ergonomía para largas sesiones.',
        precio: 349990,
        stock: 7,
        imagen: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Mouse Logitech G502 HERO',
        categoria: 'Mouse',
        descripcion: 'Sensor óptico avanzado para máxima precisión.',
        precio: 49990,
        stock: 25,
        imagen: 'https://images.unsplash.com/photo-1615663245857-acda5b2b15d5?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Mousepad Razer Goliathus',
        categoria: 'Mousepad',
        descripcion: 'Superficie de tela texturizada para velocidad.',
        precio: 29990,
        stock: 30,
        imagen: 'https://images.unsplash.com/photo-1629377750731-9a74421b53f6?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Polera Gamer Level-Up',
        categoria: 'Poleras Personalizadas',
        descripcion: 'Estilo único para verdaderos gamers.',
        precio: 14990,
        stock: 50,
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'
      },
      // 1. NUEVO PRODUCTO AGREGADO
      {
        nombre: 'Polerón Gamer Pro',
        categoria: 'Polerones Gamers Personalizados',
        descripcion: 'Polerón con capucha y diseño exclusivo de la tienda.',
        precio: 29990,
        stock: 40,
        imagen: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
      }
    ];

    await this.productRepo.save(productos);
  }
}