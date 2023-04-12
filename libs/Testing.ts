import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ModuleMetadata, Provider } from '@nestjs/common';
import { SampleHandler } from '../src/sample/application/command/SampleHandler';
import { SampleFactory } from '../src/sample/domain/factory/SampleFactory';
import { InjectionToken } from '../src/sample/application/InjectionToken';
import { EventPublisher } from '@nestjs/cqrs';
import { SampleRepositoryImplement } from '../src/sample/infrastructure/repository/SampleRepositoryImplement';

export const nestAppForTest = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};

export const testModules = async () => {
  const SampleRepoProvider: Provider = {
    provide: InjectionToken.SAMPLE_REPOSITORY,
    useClass: SampleRepositoryImplement,
  };

  const factoryProvider: Provider = {
    provide: SampleFactory,
    useValue: {},
    useClass: SampleFactory,
  };

  const eventPublisher: Provider = {
    provide: EventPublisher,
    useValue: {
      mergeObjectContext: jest.fn(),
    },
  };
  const providers: Provider[] = [
    SampleHandler,
    SampleFactory,
    SampleRepoProvider,
    factoryProvider,
    eventPublisher,
  ];
  const moduleMetadata: ModuleMetadata = { providers };
  const testModule = await Test.createTestingModule(moduleMetadata).compile();

  return testModule;
};
