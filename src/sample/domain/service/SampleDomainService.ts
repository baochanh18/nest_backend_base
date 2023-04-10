import { Sample } from '../aggregate/Sample';

export class CheckIdOptions {
  readonly sample: Sample;
  readonly receiveId: number;
}

export class SampleDomainService {
  checkId({ sample, receiveId }: CheckIdOptions): void {
    sample.sampleErrorEvent(receiveId);
  }
}
