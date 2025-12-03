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
    // ❌ Quitamos la llamada a insertarVentasDiarias()
  }

  private async insertarUsuarios() {
    const total = await this.userRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Usuarios...');
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash('123', salt);

    const usuarios = [
      { nombre: 'Super Admin', email: 'admin@tienda.cl', password, role: UserRole.ADMIN },
      { nombre: 'Juan Vendedor', email: 'vendedor@tienda.cl', password, role: UserRole.VENDEDOR },
      { nombre: 'Cliente Pedro', email: 'cliente@tienda.cl', password, role: UserRole.CLIENTE },
    ];
    await this.userRepo.save(usuarios);
  }

  private async insertarProductos() {
    const total = await this.productRepo.count();
    if (total > 0) return;

    console.log('🌱 Sembrando Productos con Imágenes...');

    const productos = [
      {
        nombre: 'Nintendo Switch',
        precio: 300000,
        stock: 10,
        imagen: 'https://images.unsplash.com/photo-1578303512597-81de50a55096?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'PlayStation 5',
        precio: 550000,
        stock: 5,
        imagen: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Polera React',
        precio: 15000,
        stock: 50,
        imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Sillón Gamer',
        precio: 120000,
        stock: 7,
        imagen: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'
      },
      {
        nombre: 'Audífonos Sony',
        precio: 45000,
        stock: 20,
        imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
      },
    ];

    await this.productRepo.save(productos);
  }
}