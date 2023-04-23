import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { SelectQueryBuilder } from 'typeorm';

import { writeConnection } from '../../../../libs/DatabaseModule';
import { SampleEntity } from '../entity/Sample';
import { SampleRepository } from '../../domain/repository/SampleRepository';
import { Sample } from '../../domain/aggregate/sample';
import { SampleFactory } from '../../domain/factory';
import { REDIS_CLIENT } from '../../../../libs/RedisModule';

export class SampleRepositoryImplement implements SampleRepository {
  @Inject() private readonly sampleFactory: SampleFactory;
  @Inject(REDIS_CLIENT)
  private readonly redisClient: Redis;

  async save(data: Sample | Sample[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = this.sampleFactory.createEntityArray(models);
    await writeConnection.manager.getRepository(SampleEntity).save(entities);
  }

  async findById(id: number): Promise<Sample | null> {
    const entity = await this.baseQuery()
      .where(`sample.id = :id`, { id })
      .getOne();
    return entity ? this.sampleFactory.reconstitute(entity) : null;
  }

  async getCacheData(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async setCacheData(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  private baseQuery(): SelectQueryBuilder<SampleEntity> {
    return writeConnection.manager
      .getRepository(SampleEntity)
      .createQueryBuilder('sample')
      .leftJoin('sample.sampleDetail', 'sampleDetail')
      .select([
        'sample.id',
        'sample.createdAt',
        'sample.updatedAt',
        'sample.deletedAt',
        'sampleDetail.id',
        'sampleDetail.sampleId',
        'sampleDetail.content',
        'sampleDetail.createdAt',
        'sampleDetail.updatedAt',
      ]);
  }
}
