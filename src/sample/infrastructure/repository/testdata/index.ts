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

export { sampleData };
