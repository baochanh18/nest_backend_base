import { IQueryResult } from '@nestjs/cqrs';

export class FindSampleByIdResult implements IQueryResult {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}
