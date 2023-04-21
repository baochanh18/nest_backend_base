import { INestApplication, Provider } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { EventPublisher } from '@nestjs/cqrs';

import { SampleCommand } from './SampleCommand';
import { SampleHandler } from './SampleHandler';
import { InjectionToken } from '../InjectionToken';
import { SampleFactory } from '../../domain/factory/SampleFactory';

import { SampleRepository } from '../../domain/repository/SampleRepository';
import { testingConfigure } from '../../../../libs/Testing';
import { SampleRepositoryImplement } from '../../infrastructure/repository/SampleRepositoryImplement';
import { SampleDetailFactory } from '../../domain/factory/SampleDetailFactory';
import { SampleAggregate } from '../../domain/aggregate/sample';
import { sampleData } from './testdata';

jest.mock('../../../../libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('SampleHandler', () => {
  let handler: SampleHandler;
  let repository: SampleRepository;
  let testModule: TestingModule;
  let app: INestApplication;
  const providers: Provider[] = [
    SampleHandler,
    SampleFactory,
    SampleDetailFactory,
    {
      provide: InjectionToken.SAMPLE_REPOSITORY,
      useClass: SampleRepositoryImplement,
    },
    {
      provide: EventPublisher,
      useValue: {
        mergeObjectContext: (properties) => {
          return new SampleAggregate(properties);
        },
      },
    },
  ];

  beforeAll(async () => {
    const testConnection = await testingConfigure(providers);
    testModule = testConnection.testModule;
    app = testConnection.app;
    handler = testModule.get(SampleHandler);
    repository = testModule.get(InjectionToken.SAMPLE_REPOSITORY);
  });

  afterAll(async () => {
    jest.resetAllMocks();
    await app.close();
  });
  describe('execute', () => {
    let saveSpy: jest.SpyInstance;
    describe('should create a new sample when no current sample exists', () => {
      beforeAll(async () => {
        const command = new SampleCommand(1, 'sample content');
        jest.spyOn(repository, 'findById').mockResolvedValueOnce(null);
        saveSpy = jest.spyOn(repository, 'save').mockResolvedValue();
        await handler.execute(command);
      });
      afterAll(() => {
        jest.resetAllMocks();
      });
      it('save function is called with expected arrgument', () => {
        expect(saveSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 1,
            sampleDetail: expect.objectContaining({
              content: 'sample content',
              id: null,
              sampleId: null,
            }),
          }),
        );
      });
    });

    describe('should update an existing sample when a current sample exists', () => {
      beforeAll(async () => {
        const command = new SampleCommand(1, 'sample content');
        jest.spyOn(repository, 'findById').mockResolvedValueOnce(sampleData);
        saveSpy = jest.spyOn(repository, 'save').mockResolvedValue();
        await handler.execute(command);
      });
      afterAll(() => {
        jest.resetAllMocks();
      });
      it('save function is called with expected arrgument', () => {
        expect(saveSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 1,
            sampleDetail: expect.objectContaining({
              content: 'sample content',
              id: 1,
              sampleId: 1,
            }),
          }),
        );
      });
    });
  });
});
