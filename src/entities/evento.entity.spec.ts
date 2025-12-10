import { Evento } from './evento.entity';

describe('Evento Entity', () => {
  it('debería estar definido', () => {
    expect(new Evento()).toBeDefined();
  });

  it('debería guardar la información del evento', () => {
    const evento = new Evento();
    evento.titulo = 'Torneo LoL';
    evento.puntos = 100;
    evento.ubicacion = 'Santiago';
    evento.fecha = '2025-10-15';
    evento.hora = '18:00';

    expect(evento.titulo).toBe('Torneo LoL');
    expect(evento.puntos).toBe(100);
    expect(evento.ubicacion).toBe('Santiago');
  });
});