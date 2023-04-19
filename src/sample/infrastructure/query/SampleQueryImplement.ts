import { Inject, Injectable } from '@nestjs/common';

import { readConnection } from '../../../../libs/DatabaseModule';

import { SampleEntity } from '../entity/Sample';

import { SampleQuery } from '../../domain/queryRepository/SampleQuery';
import { FindSampleByIdResult } from '../../application/query/FindSampleById/FindSampleByIdResult';
import { FindSamplesResult } from '../../application/query/FindSamples/FindSamplesResult';
import { FindSamplesQuery } from '../../application/query/FindSamples/FindSamplesQuery';

@Injectable()
export class SampleQueryImplement implements SampleQuery {
  async findById(id: number): Promise<FindSampleByIdResult | null> {
    const entity = await readConnection
      .getRepository(SampleEntity)
      .findOneBy({ id });
    return entity
      ? {
          id: entity.id,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          deletedAt: entity.deletedAt,
        }
      : null;
  }

  async find(query: FindSamplesQuery): Promise<FindSamplesResult> {
    return readConnection
      .getRepository(SampleEntity)
      .find({
        skip: query.skip,
        take: query.skip,
      })
      .then((entities) => ({
        samples: entities.map((entity) => ({
          id: entity.id,
        })),
      }));
  }
}
