import { Sample } from '../aggregate/Sample';

export interface SampleRepository {
  save: (sample: Sample | Sample[]) => Promise<void>;
  findById: (id: number) => Promise<Sample | null>;
  getCacheData: (key: string) => Promise<string | null>;
  setCacheData: (key: string, value: string) => Promise<void>;
}
