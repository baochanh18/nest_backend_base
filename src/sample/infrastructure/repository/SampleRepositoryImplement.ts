import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

import { writeConnection } from '../../../../libs/DatabaseModule';

import { SampleEntity } from '../entity/Sample';

import { SampleRepository } from '../../domain/repository/SampleRepository';
import {
  Sample,
  SampleAggregate,
  SampleProperties,
} from '../../domain/aggregate/sample';
import { SampleFactory } from '../../domain/factory/SampleFactory';
import { REDIS_CLIENT } from '../../../../libs/RedisModule';
import { SampleDetailEntity } from '../entity/SampleDetail';
import {
  SampleDetail,
  SampleDetailAggregate,
  SampleDetailProperties,
} from '../..//domain/aggregate/sampleDetail';
import { SampleDetailFactory } from '../../domain/factory/SampleDetailFactory';
import { SelectQueryBuilder } from 'typeorm';

export class SampleRepositoryImplement implements SampleRepository {
  @Inject() private readonly sampleFactory: SampleFactory;
  @Inject() private readonly sampleDetailFactory: SampleDetailFactory;
  @Inject(REDIS_CLIENT)
  private readonly redisClient: Redis;

  async save(data: Sample | Sample[]): Promise<void> {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeConnection.manager.getRepository(SampleEntity).save(entities);
  }

  async findById(id: number): Promise<Sample | null> {
    const entity = await this.baseQuery()
      .where(`sample.id = :id`, { id })
      .getOne();
    return entity ? this.entityToModel(entity) : null;
  }

  async getCacheData(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async setCacheData(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  private modelToEntity(model: Sample): SampleEntity {
    const { sampleDetail, ...properties } = JSON.parse(
      JSON.stringify(model),
    ) as SampleProperties;
    const entity = new SampleEntity();
    Object.assign(entity, properties);

    if (sampleDetail) {
      const { id: detailId, ...detailProps } = JSON.parse(
        JSON.stringify(sampleDetail),
      ) as SampleDetailProperties;
      const sampleDetailEntity = new SampleDetailEntity();
      Object.assign(sampleDetailEntity, detailProps, {
        id: detailId,
        sampleId: entity.id,
      });
      entity.sampleDetail = sampleDetailEntity;
    }

    return entity;
  }

  private entityToModel(entity: SampleEntity): Sample {
    const { sampleDetail, ...properties } = entity;
    const sampleDetailAggregate =
      sampleDetail && this.sampleDetailFactory.create(sampleDetail);
    return this.sampleFactory.reconstitute({
      ...properties,
      sampleDetail: sampleDetailAggregate,
    });
  }

  private baseQuery(): SelectQueryBuilder<SampleEntity> {
    return writeConnection.manager
      .getRepository(SampleEntity)
      .createQueryBuilder('sample')
      .leftJoinAndSelect('sample.sampleDetail', 'sampleDetail');
  }
}
