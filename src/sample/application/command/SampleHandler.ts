import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '../../../../libs/Transactional';

import { SampleCommand } from './SampleCommand';
import { InjectionToken } from '../InjectionToken';

import { SampleFactory } from '../../domain/factory/SampleFactory';
import { SampleRepository } from '../../domain/repository/SampleRepository';

@CommandHandler(SampleCommand)
export class SampleHandler implements ICommandHandler<SampleCommand, void> {
  @Inject(InjectionToken.SAMPLE_REPOSITORY)
  private readonly sampleRepository: SampleRepository;
  @Inject() private readonly sampleFactory: SampleFactory;

  @Transactional()
  async execute(command: SampleCommand): Promise<void> {
    const sample = this.sampleFactory.create({
      ...command,
    });

    if (sample.compareId(1)) {
      await this.sampleRepository.findById(1);
    }
    sample.commit();
  }
}
