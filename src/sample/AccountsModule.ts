import addYears from 'date-fns/addYears';
import { LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// import { PasswordModule } from 'libs/PasswordModule';
import { writeConnection } from '../../libs/DatabaseModule';
import { TaskPublisher, TASK_PUBLISHER } from '../../libs/MessageModule';

import { SampleQueryImplement } from '../sample/infrastructure/query/AccountQueryImplement';
import { SampleRepositoryImplement } from '../sample/infrastructure/repository/AccountRepositoryImplement';
import { SampleEntity } from '../sample/infrastructure/entity/SampleEntity';

import { SamplesController } from '../sample/interface/SamplesController';
import { SampleTaskController } from '../sample/interface/SampleTaskController';

import { SampleHandler } from '../sample/application/command/SampleHandler';
import { FindSampleByIdHandler } from '../sample/application/query/FindSampleByIdHandler';
import { FindSamplesHandler } from '../sample/application/query/FindSamplesHandler';
import { InjectionToken } from '../sample/application/InjectionToken';
import { SampleEventHandler } from './application/event/SampleEventHandler';

import { SampleDomainService } from '../sample/domain/SampleDomainService';
import { SampleFactory } from '../sample/domain/SampleFactory';
import { SampleCommand } from '../sample/application/command/SampleCommand';

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
export class AccountsModule {
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
