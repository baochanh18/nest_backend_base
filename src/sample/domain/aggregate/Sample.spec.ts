import { InternalServerErrorException } from '@nestjs/common';

import { SampleAggregate, SampleProperties } from './Sample';
import { SampleEvent } from '../event/SampleEvent';

describe('Sample', () => {
  describe('sampleEvent', () => {
    it('should apply SampleEvent', () => {
      const sample = new SampleAggregate({
        id: 1,
      } as SampleProperties);

      sample.sampleEvent();

      const appliedEvent = sample.getUncommittedEvents();

      expect(appliedEvent).toEqual([new SampleEvent(1)]);
    });
  });

  describe('sampleErrorEvent', () => {
    it('should throw InternalServerErrorException when given id is under 1', () => {
      const sample = new SampleAggregate({} as SampleProperties);

      expect(() => sample.sampleErrorEvent(0)).toThrowError(
        InternalServerErrorException,
      );
    });
  });
});
