import { plainToInstance } from 'class-transformer';
import { SampleAggregate } from '../../../domain/aggregate/sample';

const sampleData: SampleAggregate[] = plainToInstance(SampleAggregate, [
  {
    id: 1,
    sampleDetail: {
      id: 1,
      sampleId: 1,
      content: 'test',
    },
  },
  {
    id: 2,
    sampleDetail: {
      id: 2,
      sampleId: 2,
      content: 'testhoge',
    },
  },
]);

const updateSampleData: SampleAggregate[] = plainToInstance(SampleAggregate, [
  {
    id: 1,
    sampleDetail: {
      id: 1,
      sampleId: 1,
      content: 'updated content 1',
    },
  },
  {
    id: 2,
    sampleDetail: {
      id: 2,
      sampleId: 2,
      content: 'updated content 2',
    },
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

export { sampleData, updateSampleData, sampleKeyValues };
