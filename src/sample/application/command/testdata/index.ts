import { SampleAggregate } from '../../../domain/aggregate/sample';
import { SampleDetailAggregate } from '../../../domain/aggregate/sampleDetail';

const sampleDetailData = new SampleDetailAggregate({
  id: 1,
  sampleId: 1,
  content: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
});
const sampleData = new SampleAggregate({
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  sampleDetail: sampleDetailData,
});

export { sampleData, sampleDetailData };
