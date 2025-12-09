import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// IMPORTANTE: Importar UserRole para poder hacer el casting
import { Usuario, UserRole } from '../entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    // CORRECCIÓN: Convertimos los tipos manualmente
    const usuario = this.usuarioRepo.create({
      ...createUsuarioDto,
      // 1. Convertimos string a Date
      fechaNacimiento: new Date(createUsuarioDto.fechaNacimiento),
      // 2. Forzamos el string a ser tratado como UserRole
      role: (createUsuarioDto.role as UserRole) || UserRole.CLIENTE,
    });

    return this.usuarioRepo.save(usuario);
  }

  findAll() {
    return this.usuarioRepo.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepo.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async findOneByEmail(email: string) {
    return this.usuarioRepo.findOneBy({ email });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    // Preparar datos para actualizar corrigiendo tipos si vienen definidos
    const updateData: any = { ...updateUsuarioDto };

    if (updateUsuarioDto.fechaNacimiento) {
      updateData.fechaNacimiento = new Date(updateUsuarioDto.fechaNacimiento);
    }

    if (updateUsuarioDto.role) {
      updateData.role = updateUsuarioDto.role as UserRole;
    }

    // CORRECCIÓN: Usamos los datos ya convertidos
    const usuario = await this.usuarioRepo.preload({
      id: id,
      ...updateData,
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return this.usuarioRepo.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    return this.usuarioRepo.remove(usuario);
  }
}