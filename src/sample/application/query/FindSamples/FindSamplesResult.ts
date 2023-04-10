import { IQueryResult } from '@nestjs/cqrs';

export class FindSamplesResult implements IQueryResult {
  constructor(
    readonly samples: Readonly<{
      id: number;
    }>[],
  ) {}
}
