import { FindSampleByIdResult } from './FindSampleById/FindSampleByIdResult';
import { FindSamplesQuery } from './FindSamples/FindSamplesQuery';
import { FindSamplesResult } from './FindSamples/FindSamplesResult';

export interface SampleQuery {
  findById: (id: number) => Promise<FindSampleByIdResult | null>;
  find: (query: FindSamplesQuery) => Promise<FindSamplesResult>;
}
