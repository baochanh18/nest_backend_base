import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/build/package/ClassTransformer';

export abstract class FactoryHelper {
  protected createEntity<E, P>(entity: ClassType<E>, plainObject: P) {
    return plainToClass(entity, plainObject, { excludeExtraneousValues: true });
  }

  protected createEntityArray<E, P>(
    entity: ClassType<E>,
    plainObjectArray: P[],
  ) {
    return plainToClass(entity, plainObjectArray, {
      excludeExtraneousValues: true,
    });
  }
}
