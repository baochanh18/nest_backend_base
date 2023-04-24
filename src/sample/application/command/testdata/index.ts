import { plainToInstance } from 'class-transformer';
import { SampleAggregate } from '../../../domain/aggregate/sample';

const sampleData = plainToInstance(SampleAggregate, {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  sampleDetail: {
    id: 1,
    sampleId: 1,
    content: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
});

export { sampleData };
