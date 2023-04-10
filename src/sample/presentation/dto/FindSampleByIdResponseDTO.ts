import { ApiProperty } from '@nestjs/swagger';

import { FindSampleByIdResult } from '../../application/query/FindSampleById/FindSampleByIdResult';

export class FindSampleByIdResponseDTO extends FindSampleByIdResult {
  @ApiProperty({ example: 1 })
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ nullable: true, example: null })
  readonly deletedAt: Date | null;
}
