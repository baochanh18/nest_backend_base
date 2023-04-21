import { Sample } from '../aggregate/sample';
import { SampleDomainService, CheckIdOptions } from './SampleDomainService';

describe('SampleDomainService', () => {
  let service: SampleDomainService;
  let sample: Sample;

  beforeAll(() => {
    service = new SampleDomainService();
    sample = {
      sampleErrorEvent: jest.fn(),
      compareId: jest.fn(),
      sampleEvent: jest.fn(),
      getSample: jest.fn(),
      commit: jest.fn(),
    };
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
