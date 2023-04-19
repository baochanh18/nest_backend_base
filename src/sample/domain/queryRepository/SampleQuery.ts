import { FindSampleByIdResult } from '../../application/query/FindSampleById/FindSampleByIdResult';
import { FindSamplesQuery } from '../../application/query/FindSamples/FindSamplesQuery';
import { FindSamplesResult } from '../../application/query/FindSamples/FindSamplesResult';

export interface SampleQuery {
  findById: (id: number) => Promise<FindSampleByIdResult | null>;
  find: (query: FindSamplesQuery) => Promise<FindSamplesResult>;
}
