import { InternalServerErrorException } from '@nestjs/common';

import { SampleDetailAggregate, SampleDetailProperties } from '.';

describe('SampleDetail', () => {
  let sampleDetail: SampleDetailAggregate;
  let updatedSampleDetail: SampleDetailAggregate;

  beforeAll(() => {
    sampleDetail = new SampleDetailAggregate({
      id: 1,
      content: 'test',
      sampleId: 1,
    } as SampleDetailProperties);
  });

  describe('updateContent', () => {
    beforeAll(() => {
      sampleDetail.updateContent('hogehoge');
      updatedSampleDetail = new SampleDetailAggregate({
        id: 1,
        content: 'hogehoge',
        sampleId: 1,
      } as SampleDetailProperties);
    });
    it('content updated successfully', () => {
      expect(sampleDetail).toEqual(updatedSampleDetail);
    });
  });
});
