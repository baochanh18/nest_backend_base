import { Sample } from './Sample';
import { SampleDomainService, CheckIdOptions } from './SampleDomainService';

describe('SampleDomainService', () => {
  describe('checkId', () => {
    it('should run checkId', () => {
      const service = new SampleDomainService();

      const sample = { sampleErrorEvent: jest.fn() } as unknown as Sample;

      const options: CheckIdOptions = {
        sample,
        receiveId: 1,
      };

      expect(service.checkId(options)).toEqual(undefined);
      expect(sample.sampleErrorEvent).toBeCalledTimes(1);
      expect(sample.sampleErrorEvent).toBeCalledWith(options.receiveId);
    });
  });
});
