import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('@nestjs/swagger', () => ({
  SwaggerModule: {
    createDocument: jest.fn(),
    setup: jest.fn(),
  },
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn(),
  })),
  ApiProperty: jest.fn(() => () => {}),
  ApiTags: jest.fn(() => () => {}),
  ApiOperation: jest.fn(() => () => {}),
  ApiResponse: jest.fn(() => () => {}),
  ApiBearerAuth: jest.fn(() => () => {}),
  ApiBody: jest.fn(() => () => {}),
  ApiParam: jest.fn(() => () => {}),
  PartialType: jest.fn((cls) => cls),
}));

jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);

describe('Main (Bootstrap)', () => {
  let appMock: any;

  beforeEach(() => {
    jest.clearAllMocks();

    appMock = {
      setGlobalPrefix: jest.fn(),
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(appMock);
  });

  it('debería inicializar la aplicación correctamente', async () => {
    jest.isolateModules(() => {
      require('./main');
    });

    await new Promise((resolve) => setTimeout(resolve, 50));


    expect(NestFactory.create).toHaveBeenCalledWith(expect.any(Function));

    expect(appMock.setGlobalPrefix).toHaveBeenCalledWith('api');
    expect(appMock.enableCors).toHaveBeenCalled();

    expect(appMock.useGlobalPipes).toHaveBeenCalledWith(expect.any(Object));

    // Opcional: Verificamos las opciones del pipe
    const pipeInstance = (appMock.useGlobalPipes as jest.Mock).mock.calls[0][0];
    expect(pipeInstance.validatorOptions).toEqual(expect.objectContaining({
      whitelist: true,
      forbidNonWhitelisted: true,
    }));


    expect(SwaggerModule.createDocument).toHaveBeenCalled();
    expect(SwaggerModule.setup).toHaveBeenCalledWith('api', appMock, undefined);

    const listenPort = (appMock.listen as jest.Mock).mock.calls[0][0];
    expect([4000, '4000']).toContain(listenPort);
  });
});