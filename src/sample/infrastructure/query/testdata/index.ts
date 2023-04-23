import { plainToInstance } from 'class-transformer';
import { SampleEntity } from '../../entity/Sample';
import { SampleDetailEntity } from '../../entity/SampleDetail';

const sampleData: SampleEntity[] = plainToInstance(SampleEntity, [
  {
    id: 1,
  },
  {
    id: 2,
  },
]);

const sampleDetailData: SampleDetailEntity[] = plainToInstance(
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
