import { Sample } from './Sample';

export interface SampleRepository {
  save: (sample: Sample | Sample[]) => Promise<void>;
  findById: (id: number) => Promise<Sample | null>;
}
