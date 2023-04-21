import { InternalServerErrorException } from '@nestjs/common';

import { SampleAggregate, SampleProperties } from '.';
import { SampleEvent } from '../../event/SampleEvent';

describe('Sample', () => {
  let sample: SampleAggregate;

  beforeEach(() => {
    sample = new SampleAggregate({ id: 1 } as SampleProperties);
  });

  describe('compareId', () => {
    it('should return true when given ID is the same as sample ID', () => {
      const result = sample.compareId(1);
      expect(result).toEqual(true);
    });

    it('should return false when given ID is different from sample ID', () => {
      const result = sample.compareId(2);
      expect(result).toEqual(false);
    });
  });

  describe('sampleEvent', () => {
    it('should add a SampleEvent to the queue', () => {
      sample.sampleEvent();

      const appliedEvent = sample.getUncommittedEvents();

      expect(appliedEvent).toEqual([new SampleEvent(1)]);
    });
  });

  describe('sampleErrorEvent', () => {
    it('should throw InternalServerErrorException when given id is under 1', () => {
      expect(() => sample.sampleErrorEvent(0)).toThrowError(
        InternalServerErrorException,
      );
    });
  });
});
