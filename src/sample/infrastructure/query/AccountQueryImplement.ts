import { Inject, Injectable } from '@nestjs/common';

import { readConnection } from '../../../../libs/DatabaseModule';

import { SampleEntity } from '../entity/SampleEntity';

import { SampleQuery } from '../../application/query/SampleQuery';
import { FindSampleByIdResult } from '../../application/query/FindSampleByIdResult';
import { FindSamplesResult } from '../../application/query/FindSamplesResult';
import { FindSamplesQuery } from '../../application/query/FindSamplesQuery';

@Injectable()
export class SampleQueryImplement implements SampleQuery {
  async findById(id: number): Promise<FindSampleByIdResult | null> {
    return readConnection
      .getRepository(SampleEntity)
      .findOneBy({ id })
      .then((entity) =>
        entity
          ? {
              id: entity.id,
              createdAt: entity.createdAt,
              updatedAt: entity.updatedAt,
              deletedAt: entity.deletedAt,
            }
          : null,
      );
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
