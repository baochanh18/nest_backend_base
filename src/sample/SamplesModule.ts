import { Cron, CronExpression } from '@nestjs/schedule';
import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { SampleQueryImplement } from './infrastructure/query/SampleQueryImplement';
import { SampleRepositoryImplement } from './infrastructure/repository/SampleRepositoryImplement';

import { SamplesController } from './presentation/SamplesController';
import { SampleTaskController } from './presentation/SampleTaskController';

import { SampleHandler } from './application/command/SampleHandler';
import { FindSampleByIdHandler } from './application/query/FindSampleById/FindSampleByIdHandler';
import { FindSamplesHandler } from './application/query/FindSamples/FindSamplesHandler';
import { InjectionToken } from './application/InjectionToken';
import { SampleEventHandler } from './application/event/SampleEventHandler';

import { SampleDomainService } from './domain/service/SampleDomainService';
import { SampleFactory } from './domain/factory/SampleFactory';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.SAMPLE_REPOSITORY,
    useClass: SampleRepositoryImplement,
  },
  {
    provide: InjectionToken.SAMPLE_QUERY,
    useClass: SampleQueryImplement,
  },
];

const application = [
  FindSampleByIdHandler,
  SampleHandler,
  FindSamplesHandler,
  SampleEventHandler,
];

const domain = [SampleDomainService, SampleFactory];

@Module({
  imports: [CqrsModule],
  controllers: [SamplesController, SampleTaskController],
  providers: [Logger, ...infrastructure, ...application, ...domain],
})
export class SamplesModule {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sampleTask(): Promise<void> {
    // SQS message
  }
}
