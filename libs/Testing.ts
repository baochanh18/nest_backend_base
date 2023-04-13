import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ModuleMetadata, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionSource } from './DatabaseSource';
import { DataSourceOptions } from 'typeorm';
import { DatabaseModule } from './DatabaseModule';
import { SamplesModule } from '../src/sample/SamplesModule';
import { MessageModule } from './MessageModule';

export const nestAppForTest = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};

export const testModules = async (providers: Provider[]) => {
  const imports = [
    TypeOrmModule.forRoot(connectionSource as DataSourceOptions),
    // DatabaseModule,
  ];
  const moduleMetadata: ModuleMetadata = {
    providers: [...providers, DatabaseModule],
    // imports,
  };
  const testModule = await Test.createTestingModule(moduleMetadata).compile();

  return testModule;
};
