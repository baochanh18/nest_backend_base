import { IQueryResult } from '@nestjs/cqrs';

type SampleDetailResult = {
  readonly id: number;
  readonly sampleId: number;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
};

export class FindSampleByIdResult implements IQueryResult {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly sampleDetail: SampleDetailResult | null;
}
