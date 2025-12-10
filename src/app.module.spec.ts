import { AppModule } from './app.module';

describe('AppModule', () => {
  it('debería estar definido', () => {
    expect(new AppModule()).toBeDefined();
  });
});