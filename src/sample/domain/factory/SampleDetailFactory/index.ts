import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import {
  SampleDetail,
  SampleDetailAggregate,
  SampleDetailProperties,
} from '../../aggregate/sampleDetail';

type CreateSampleDetailOptions = Readonly<{
  id: number | null;
  sampleId: number | null;
  content: string | null;
}>;

export class SampleDetailFactory {
  create(options: CreateSampleDetailOptions): SampleDetailAggregate {
    return new SampleDetailAggregate({
      ...options,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  reconstitute(properties: SampleDetailProperties): SampleDetail {
    return new SampleDetailAggregate(properties);
  }
}
