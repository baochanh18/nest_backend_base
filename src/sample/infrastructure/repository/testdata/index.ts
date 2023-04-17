import { plainToClass } from 'class-transformer/build/package';
import { SampleAggregate } from '../../../domain/aggregate/Sample';

const singleSampleData: SampleAggregate = plainToClass(SampleAggregate, {
  id: 1,
});

const multipleSampleData: SampleAggregate[] = plainToClass(SampleAggregate, [
  {
    id: 1,
  },
  {
    id: 2,
  },
]);

export { singleSampleData, multipleSampleData };
