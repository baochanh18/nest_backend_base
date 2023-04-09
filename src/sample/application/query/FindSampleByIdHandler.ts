import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { InjectionToken } from '../InjectionToken';
import { SampleQuery } from './SampleQuery';
import { FindSampleByIdQuery } from './FindSampleByIdQuery';
import { FindSampleByIdResult } from './FindSampleByIdResult';

import { ErrorMessage } from '../../domain/ErrorMessage';

@QueryHandler(FindSampleByIdQuery)
export class FindSampleByIdHandler
  implements IQueryHandler<FindSampleByIdQuery, FindSampleByIdResult>
{
  @Inject(InjectionToken.SAMPLE_QUERY) readonly sampleQuery: SampleQuery;

  async execute(query: FindSampleByIdQuery): Promise<FindSampleByIdResult> {
    const data = await this.sampleQuery.findById(query.id);
    if (!data) throw new NotFoundException(ErrorMessage.INVALID_ID);

    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new FindSampleByIdResult());

    if (dataKeys.length < resultKeys.length)
      throw new InternalServerErrorException();

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey)))
      throw new InternalServerErrorException();

    dataKeys
      .filter((dataKey) => !resultKeys.includes(dataKey))
      .forEach((dataKey) => delete data[dataKey]);

    return data;
  }
}
