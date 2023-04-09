import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectionToken } from 'src/sample/application/InjectionToken';
import { SampleQuery } from 'src/sample/application/query/SampleQuery';
import { FindSamplesQuery } from 'src/sample/application/query/FindSamplesQuery';
import { FindSamplesResult } from 'src/sample/application/query/FindSamplesResult';

@QueryHandler(FindSamplesQuery)
export class FindSamplesHandler
  implements IQueryHandler<FindSamplesQuery, FindSamplesResult>
{
  @Inject(InjectionToken.SAMPLE_QUERY) readonly sampleQuery: SampleQuery;

  async execute(query: FindSamplesQuery): Promise<FindSamplesResult> {
    return this.sampleQuery.find(query);
  }
}
