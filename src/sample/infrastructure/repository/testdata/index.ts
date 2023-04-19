import { plainToClass } from 'class-transformer/build/package';
import { SampleAggregate } from '../../../domain/aggregate/Sample';

const sampleData: SampleAggregate[] = plainToClass(SampleAggregate, [
  {
    id: 1,
  },
  {
    id: 2,
  },
]);

const sampleKeyValues = [
  {
    key: 'test-key-1',
    value: 'test-value-1',
  },
  {
    key: 'test-key-2',
    value: 'test-value-2',
  },
];

export { sampleData, sampleKeyValues };
