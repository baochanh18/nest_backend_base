import { Sample } from '../aggregate/Sample';
import { SampleDomainService, CheckIdOptions } from './SampleDomainService';

describe('SampleDomainService', () => {
  let service: SampleDomainService;
  let sample: Sample;

  beforeAll(() => {
    service = new SampleDomainService();
    sample = { sampleErrorEvent: jest.fn() } as unknown as Sample;
  });

  describe('checkId', () => {
    let options: CheckIdOptions;
    beforeAll(() => {
      options = {
        sample,
        receiveId: 1,
      };

      service.checkId(options);
    });
    it('should run checkId', () => {
      expect(sample.sampleErrorEvent).toHaveBeenCalledTimes(1);
      expect(sample.sampleErrorEvent).toHaveBeenCalledWith(options.receiveId);
    });
  });
});
