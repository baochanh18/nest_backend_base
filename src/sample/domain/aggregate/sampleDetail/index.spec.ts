import { SampleDetail, SampleDetailProperties } from '.';

describe('SampleDetail', () => {
  let sampleDetail: SampleDetail;
  let updatedSampleDetail: SampleDetail;

  beforeAll(() => {
    sampleDetail = new SampleDetail({
      id: 1,
      content: 'test',
      sampleId: 1,
    } as SampleDetailProperties);
  });

  describe('updateContent', () => {
    beforeAll(() => {
      sampleDetail.updateContent('hogehoge');
      updatedSampleDetail = new SampleDetail({
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
