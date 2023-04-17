import { INestApplication, Provider } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { SampleCommand } from './SampleCommand';
import { SampleHandler } from './SampleHandler';
import { InjectionToken } from '../InjectionToken';
import { SampleFactory } from '../../domain/factory/SampleFactory';

import { SampleRepository } from '../../domain/repository/SampleRepository';
import { testingConnection } from '../../../../libs/Testing';
import { SampleRepositoryImplement } from '../../infrastructure/repository/SampleRepositoryImplement';
import { EventPublisher } from '@nestjs/cqrs';

jest.mock('../../../../libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('SampleHandler', () => {
  let handler: SampleHandler;
  let repository: SampleRepository;
  let factory: SampleFactory;
  let testModule: TestingModule;
  let appConnection: INestApplication;
  const providers: Provider[] = [
    SampleHandler,
    SampleFactory,
    {
      provide: InjectionToken.SAMPLE_REPOSITORY,
      useClass: SampleRepositoryImplement,
    },
    {
      provide: EventPublisher,
      useValue: {
        mergeObjectContext: jest.fn(),
      },
    },
  ];

  beforeAll(async () => {
    const testConnection = await testingConnection(providers);
    testModule = testConnection.testModule;
    appConnection = testConnection.app;
    handler = testModule.get(SampleHandler);
    repository = testModule.get(InjectionToken.SAMPLE_REPOSITORY);
    factory = testModule.get(SampleFactory);
  });

  afterAll(async () => {
    await appConnection.close();
  });

  describe('execute', () => {
    const mockSample = {
      compareId: jest.fn().mockReturnValue(true),
      commit: jest.fn(),
    };
    let executeResult;
    beforeAll(async () => {
      factory.create = jest.fn().mockReturnValue(mockSample);
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new SampleCommand(1);

      executeResult = await handler.execute(command);
    });
    it('should execute SampleCommand', () => {
      expect(executeResult).toEqual(undefined);
      expect(mockSample.compareId).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(1);
      expect(mockSample.commit).toBeCalledTimes(1);
    });
  });
});
