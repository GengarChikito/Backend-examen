import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, UserRole } from '../entities/usuario.entity'; // Importamos UserRole
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private userRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const nacimiento = new Date(data.fechaNacimiento);
    const edadDif = Date.now() - nacimiento.getTime();
    const edadFecha = new Date(edadDif);
    const edad = Math.abs(edadFecha.getUTCFullYear() - 1970);

    if (edad < 18) {
      throw new BadRequestException('Debes ser mayor de 18 años para registrarte.');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(data.password, salt);

    const esDuoc = data.email.toLowerCase().includes('@duoc');
    const miCodigo = uuidv4().split('-')[0].toUpperCase();

    // CORRECCIÓN AQUÍ: Convertimos tipos explícitamente para evitar error TS2769
    const newUser = this.userRepo.create({
      nombre: data.nombre,
      email: data.email,
      password: hash,
      fechaNacimiento: new Date(data.fechaNacimiento), // String -> Date
      role: (data.role as UserRole) || UserRole.CLIENTE, // String -> Enum
      esEstudianteDuoc: esDuoc,
      miCodigoReferido: miCodigo,
      puntosLevelUp: 0
    });

    if (data.codigoReferidoUsado) {
      const referente = await this.userRepo.findOneBy({ miCodigoReferido: data.codigoReferidoUsado });
      if (referente) {
        referente.puntosLevelUp += 500;
        await this.userRepo.save(referente);
        newUser.puntosLevelUp += 100;
      }
    }

    return this.userRepo.save(newUser);
  }

  async login(email: string, pass: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      nombre: user.nombre,
      esEstudianteDuoc: user.esEstudianteDuoc
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}