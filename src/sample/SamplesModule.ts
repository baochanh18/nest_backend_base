import addYears from 'date-fns/addYears';
import { LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// import { PasswordModule } from 'libs/PasswordModule';
import { writeConnection } from '../../libs/DatabaseModule';
import { TaskPublisher, TASK_PUBLISHER } from '../../libs/MessageModule';

import { SampleQueryImplement } from './infrastructure/query/SampleQueryImplement';
import { SampleRepositoryImplement } from './infrastructure/repository/SampleRepositoryImplement';
import { SampleEntity } from './infrastructure/entity/SampleEntity';

import { SamplesController } from './interface/SamplesController';
import { SampleTaskController } from './interface/SampleTaskController';

import { SampleHandler } from './application/command/SampleHandler';
import { FindSampleByIdHandler } from './application/query/FindSampleByIdHandler';
import { FindSamplesHandler } from './application/query/FindSamplesHandler';
import { InjectionToken } from './application/InjectionToken';
import { SampleEventHandler } from './application/event/SampleEventHandler';

import { SampleDomainService } from './domain/SampleDomainService';
import { SampleFactory } from './domain/SampleFactory';
import { SampleCommand } from './application/command/SampleCommand';

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
  @Inject(TASK_PUBLISHER) private readonly taskPublisher: TaskPublisher;

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sampleTask(): Promise<void> {
    (
      await writeConnection.manager
        .getRepository(SampleEntity)
        .findBy({ updatedAt: LessThan(addYears(new Date(), -1)) })
    ).forEach((sample) =>
      this.taskPublisher.publish(
        SampleCommand.name,
        new SampleCommand(sample.id),
      ),
    );
  }
}
