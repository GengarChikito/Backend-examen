import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);
    const newUser = this.userRepo.create({ ...data, password: hash });
    return this.userRepo.save(newUser);
  }

  async login(email: string, pass: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // CORRECCIÓN: Agregamos 'nombre: user.nombre' al payload
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      nombre: user.nombre // <--- AQUÍ ESTÁ LA CLAVE
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}