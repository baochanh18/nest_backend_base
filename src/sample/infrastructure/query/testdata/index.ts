import { plainToClass } from 'class-transformer/build/package';
import { SampleAggregate } from '../../../domain/aggregate/sample';
import { SampleDetailAggregate } from '../../../domain/aggregate/sampleDetail';
import { SampleEntity } from '../../entity/Sample';
import { SampleDetailEntity } from '../../entity/SampleDetail';

const sampleData: SampleEntity[] = plainToClass(SampleEntity, [
  {
    id: 1,
  },
  {
    id: 2,
  },
]);

const sampleDetailData: SampleDetailEntity[] = plainToClass(
  SampleDetailEntity,
  [
    {
      id: 1,
      sampleId: 1,
      content: 'test',
    },
    {
      id: 2,
      sampleId: 2,
      content: 'hoge',
    },
  ],
);

export { sampleData, sampleDetailData };
