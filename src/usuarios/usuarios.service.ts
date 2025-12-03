import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll() {
    return await this.usuarioRepository.find({
      select: ['id', 'nombre', 'email', 'role']
    });
  }

  async update(id: number, data: any) {
    const user = await this.usuarioRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // === CORRECCIÓN 1: Validar contraseña vacía ===
    // Si viene password pero está vacía o son espacios, la eliminamos del objeto para no guardarla
    if (data.password && data.password.trim() !== '') {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      delete data.password; // Borramos la clave para que no sobrescriba la actual
    }

    // Actualizamos los campos en memoria
    this.usuarioRepository.merge(user, data);

    try {
      // === CORRECCIÓN 2: Capturar error de Email Duplicado ===
      return await this.usuarioRepository.save(user);
    } catch (error) {
      // El código 1062 en MySQL significa "Duplicate entry" (entrada duplicada)
      if (error.errno === 1062) {
        throw new ConflictException('El correo electrónico ya está registrado por otro usuario.');
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async remove(id: number) {
    try {
      const result = await this.usuarioRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return { message: 'Usuario eliminado correctamente' };
    } catch (error) {
      // Si el usuario tiene ventas asociadas, también podría fallar
      if (error.errno === 1451) {
        throw new ConflictException('No se puede eliminar el usuario porque tiene ventas registradas.');
      }
      throw error;
    }
  }
}