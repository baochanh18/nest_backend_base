import { FindSampleByIdResult } from './FindSampleByIdResult';
import { FindSamplesQuery } from './FindSamplesQuery';
import { FindSamplesResult } from './FindSamplesResult';

export interface SampleQuery {
  findById: (id: number) => Promise<FindSampleByIdResult | null>;
  find: (query: FindSamplesQuery) => Promise<FindSamplesResult>;
}
