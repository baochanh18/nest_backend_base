import { Sample } from '../aggregate/sample';

export class CheckIdOptions {
  readonly sample: Sample;
  readonly receiveId: number;
}

export class SampleDomainService {
  checkId({ sample, receiveId }: CheckIdOptions): void {
    sample.sampleErrorEvent(receiveId);
  }
}
