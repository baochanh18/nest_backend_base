import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

import { readConnection } from '../../../../libs/DatabaseModule';

import { SampleEntity } from '../entity/Sample';

import { SampleQuery } from '../../domain/queryRepository/SampleQuery';
import { FindSampleByIdResult } from '../../application/query/FindSampleById/FindSampleByIdResult';
import { FindSamplesResult } from '../../application/query/FindSamples/FindSamplesResult';
import { FindSamplesQuery } from '../../application/query/FindSamples/FindSamplesQuery';

@Injectable()
export class SampleQueryImplement implements SampleQuery {
  async findById(id: number): Promise<FindSampleByIdResult | null> {
    const entity = await this.getBaseQuery().where({ id }).getOne();
    return entity
      ? {
          id: entity.id,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          deletedAt: entity.deletedAt,
          sampleDetail: entity.sampleDetail,
        }
      : null;
  }

  async find(query: FindSamplesQuery): Promise<FindSamplesResult> {
    const entities = await this.getBaseQuery()
      .skip(query.skip)
      .take(query.take)
      .getMany();
    const samples = entities.map(({ id }) => ({ id }));
    return { samples };
  }

  private getBaseQuery(): SelectQueryBuilder<SampleEntity> {
    return readConnection
      .getRepository(SampleEntity)
      .createQueryBuilder('sample')
      .leftJoinAndSelect('sample.sampleDetail', 'sampleDetail');
  }
}
