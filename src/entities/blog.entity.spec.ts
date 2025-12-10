import { Blog } from './blog.entity';

describe('Blog Entity', () => {
  it('debería estar definido', () => {
    expect(new Blog()).toBeDefined();
  });

  it('debería permitir asignar contenido del blog', () => {
    const blog = new Blog();
    blog.titulo = 'Guía PC Gamer';
    blog.categoria = 'Tutoriales';
    blog.descripcion = 'Contenido largo...';
    blog.icono = '🖥️';

    expect(blog.titulo).toBe('Guía PC Gamer');
    expect(blog.categoria).toBe('Tutoriales');
    expect(blog.icono).toBe('🖥️');
  });
});