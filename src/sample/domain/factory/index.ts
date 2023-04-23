import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';

import { Sample, SampleAggregate } from '../aggregate/sample';
import { SampleEntity } from '../../infrastructure/entity/Sample';

type CreateSampleOptions = Readonly<{
  id: number;
  sampleDetail: {
    id: number | null;
    sampleId: number | null;
    content: string | null;
  } | null;
}>;

export class SampleFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  createAggregate(options: CreateSampleOptions): Sample {
    const sampleAggregate = plainToInstance(SampleAggregate, options);
    return this.eventPublisher.mergeObjectContext(sampleAggregate);
  }

  reconstitute(entity: SampleEntity): Sample {
    const sample = plainToInstance(SampleAggregate, entity);
    return this.eventPublisher.mergeObjectContext(sample);
  }

  createEntity(options: Sample): SampleEntity {
    return plainToInstance(SampleEntity, options);
  }

  createEntityArray(options: Sample[]): SampleEntity[] {
    return plainToInstance(SampleEntity, options);
  }
}
