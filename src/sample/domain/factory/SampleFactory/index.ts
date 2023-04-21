import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import {
  Sample,
  SampleAggregate,
  SampleProperties,
} from '../../aggregate/sample';
import { SampleDetailAggregate } from '../../aggregate/sampleDetail';

type CreateSampleOptions = Readonly<{
  id: number;
  sampleDetail: SampleDetailAggregate | null;
}>;

export class SampleFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateSampleOptions): Sample {
    return this.eventPublisher.mergeObjectContext(
      new SampleAggregate({
        ...options,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }),
    );
  }

  reconstitute(properties: SampleProperties): Sample {
    return this.eventPublisher.mergeObjectContext(
      new SampleAggregate(properties),
    );
  }
}
