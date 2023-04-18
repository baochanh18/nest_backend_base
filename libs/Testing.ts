import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ModuleMetadata, Provider } from '@nestjs/common';
import { DatabaseModule } from './DatabaseModule';

export const nestAppForTest = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};

export const testingConfigure = async (providers: Provider[]) => {
  const imports = [DatabaseModule];
  const moduleMetadata: ModuleMetadata = {
    providers: [...providers],
    imports,
  };
  const testModule = await Test.createTestingModule(moduleMetadata).compile();
  const app = await testModule.createNestApplication().init();
  return { testModule, app };
};
