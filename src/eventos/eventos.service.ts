import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from '../entities/evento.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento) private eventoRepo: Repository<Evento>,
  ) {}

  async create(dto: CreateEventoDto) {
    const evento = this.eventoRepo.create(dto);
    return await this.eventoRepo.save(evento);
  }

  async findAll() {
    return await this.eventoRepo.find();
  }

  async findOne(id: number) {
    const evento = await this.eventoRepo.findOneBy({ id });
    if (!evento) throw new NotFoundException('Evento no encontrado');
    return evento;
  }

  async update(id: number, dto: UpdateEventoDto) {
    const evento = await this.findOne(id);
    this.eventoRepo.merge(evento, dto);
    return await this.eventoRepo.save(evento);
  }

  async remove(id: number) {
    const evento = await this.findOne(id);
    await this.eventoRepo.remove(evento);
    return { message: 'Evento eliminado correctamente' };
  }
}