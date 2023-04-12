import { ModuleMetadata, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { SampleCommand } from './SampleCommand';
import { SampleHandler } from './SampleHandler';
import { InjectionToken } from '../InjectionToken';
import { SampleFactory } from '../../domain/factory/SampleFactory';

import { SampleRepository } from '../../domain/repository/SampleRepository';
import { testModules } from '../../../../libs/Testing';

jest.mock('../../../../libs/Transactional', () => ({
  Transactional: () => () => undefined,
}));

describe('SampleHandler', () => {
  let handler: SampleHandler;
  let repository: SampleRepository;
  let factory: SampleFactory;

  beforeEach(async () => {
    const _testModules = await testModules();

    handler = _testModules.get(SampleHandler);
    repository = _testModules.get(InjectionToken.SAMPLE_REPOSITORY);
    factory = _testModules.get(SampleFactory);
  });

  describe('execute', () => {
    it('should execute SampleCommand', async () => {
      const sample = {
        compareId: jest.fn().mockReturnValue(true),
        commit: jest.fn(),
      };

      factory.create = jest.fn().mockReturnValue(sample);
      repository.findById = jest.fn().mockResolvedValue(null);

      const command = new SampleCommand(1);

      await expect(handler.execute(command)).resolves.toEqual(undefined);
      expect(sample.compareId).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledTimes(1);
      expect(repository.findById).toBeCalledWith(1);
      expect(sample.commit).toBeCalledTimes(1);
    });
  });
});
