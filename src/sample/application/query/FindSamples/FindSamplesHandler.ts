import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectionToken } from '../../../application/InjectionToken';
import { SampleQuery } from '../../../application/query/SampleQuery';
import { FindSamplesQuery } from './FindSamplesQuery';
import { FindSamplesResult } from './FindSamplesResult';

@QueryHandler(FindSamplesQuery)
export class FindSamplesHandler
  implements IQueryHandler<FindSamplesQuery, FindSamplesResult>
{
  @Inject(InjectionToken.SAMPLE_QUERY) readonly sampleQuery: SampleQuery;

  async execute(query: FindSamplesQuery): Promise<FindSamplesResult> {
    return this.sampleQuery.find(query);
  }
}
