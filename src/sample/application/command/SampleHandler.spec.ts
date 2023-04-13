import { Provider } from '@nestjs/common';

import { SampleCommand } from './SampleCommand';
import { SampleHandler } from './SampleHandler';
import { InjectionToken } from '../InjectionToken';
import { SampleFactory } from '../../domain/factory/SampleFactory';

import { SampleRepository } from '../../domain/repository/SampleRepository';
import { testModules } from '../../../../libs/Testing';
import { SampleRepositoryImplement } from '../../infrastructure/repository/SampleRepositoryImplement';
import { EventPublisher } from '@nestjs/cqrs';

jest.mock('../../../../libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('SampleHandler', () => {
  let handler: SampleHandler;
  let repository: SampleRepository;
  let factory: SampleFactory;

  beforeAll(async () => {
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
    const _testModules = await testModules(providers);

    handler = _testModules.get(SampleHandler);
    repository = _testModules.get(InjectionToken.SAMPLE_REPOSITORY);
    factory = _testModules.get(SampleFactory);
  });

  describe('execute', () => {
    const sample = {
      compareId: jest.fn().mockReturnValue(true),
      commit: jest.fn(),
    };
    beforeAll(async () => {
      factory.create = jest.fn().mockReturnValue(sample);
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new SampleCommand(1);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
    });
    it('should execute SampleCommand', async () => {
      expect(sample.compareId).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(1);
      expect(sample.commit).toBeCalledTimes(1);
    });
  });
});
