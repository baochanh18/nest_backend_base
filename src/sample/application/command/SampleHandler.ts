import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '../../../../libs/Transactional';

import { SampleCommand } from './SampleCommand';
import { InjectionToken } from '../InjectionToken';

import { SampleFactory } from '../../domain/factory';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { Sample } from '../../domain/aggregate/sample';

@CommandHandler(SampleCommand)
export class SampleHandler implements ICommandHandler<SampleCommand, void> {
  @Inject(InjectionToken.SAMPLE_REPOSITORY)
  private readonly sampleRepository: SampleRepository;
  @Inject() private readonly sampleFactory: SampleFactory;

  async execute(command: SampleCommand): Promise<void> {
    const { content, id } = command;
    const currentSample = await this.sampleRepository.findById(id);
    if (currentSample) {
      const _currentSample = currentSample.getSample();
      const _currentSampleDetail =
        _currentSample?.sampleDetail?.getSampleDetail();

      const sample = this.sampleFactory.createAggregate({
        id,
        sampleDetail: {
          id: _currentSampleDetail?.id ?? null,
          sampleId: _currentSampleDetail?.sampleId ?? null,
          content: content,
        },
      });
      await this.dbExecute(sample);
    } else {
      const sample = this.sampleFactory.createAggregate({
        id,
        sampleDetail: {
          id: null,
          sampleId: null,
          content: content,
        },
      });

      await this.dbExecute(sample);
    }
  }

  @Transactional()
  private async dbExecute(sample: Sample): Promise<void> {
    await this.sampleRepository.save(sample);
    sample.commit();
  }
}
