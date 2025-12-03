import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no fue encontrado`);
    }
    return producto;
  }

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create(createProductoDto);
    return await this.productoRepository.save(nuevoProducto);
  }

  // === CORRECCIÓN AQUÍ ===
  async remove(id: number): Promise<void> {
    // 1. Verificamos si existe primero
    const producto = await this.findOne(id);

    try {
      // 2. Intentamos borrar
      await this.productoRepository.delete(producto.id);
    } catch (error) {
      // 3. Si MySQL lanza el error 1451, es por llave foránea (tiene ventas)
      if (error.errno === 1451) {
        throw new BadRequestException(
          'No se puede eliminar este producto porque tiene ventas registradas en el historial.',
        );
      }
      // Cualquier otro error
      throw new InternalServerErrorException('Error inesperado al eliminar el producto');
    }
  }
}