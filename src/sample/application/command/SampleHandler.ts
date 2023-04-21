import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Transactional } from '../../../../libs/Transactional';

import { SampleCommand } from './SampleCommand';
import { InjectionToken } from '../InjectionToken';

import { SampleFactory } from '../../domain/factory/SampleFactory';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { Sample } from '../../domain/aggregate/sample';
import { SampleDetailFactory } from '../../domain/factory/SampleDetailFactory';

@CommandHandler(SampleCommand)
export class SampleHandler implements ICommandHandler<SampleCommand, void> {
  @Inject(InjectionToken.SAMPLE_REPOSITORY)
  private readonly sampleRepository: SampleRepository;
  @Inject() private readonly sampleFactory: SampleFactory;
  @Inject() private readonly sampleDetailFactory: SampleDetailFactory;

  async execute(command: SampleCommand): Promise<void> {
    const { content, id } = command;
    const currentSample = await this.sampleRepository.findById(id);
    if (currentSample) {
      const _currentSample = currentSample.getSample();
      const _currentSampleDetail =
        _currentSample?.sampleDetail?.getSampleDetail();
      const sampleDetail = this.sampleDetailFactory.create({
        id: _currentSampleDetail?.id ?? null,
        sampleId: _currentSampleDetail?.sampleId ?? null,
        content: content,
      });
      const sample = this.sampleFactory.create({
        id,
        sampleDetail,
      });
      await this.dbExecute(sample);
    } else {
      const sampleDetail = this.sampleDetailFactory.create({
        id: null,
        sampleId: null,
        content: content,
      });
      const sample = this.sampleFactory.create({
        id,
        sampleDetail,
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
