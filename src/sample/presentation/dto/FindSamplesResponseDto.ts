import { ApiProperty } from '@nestjs/swagger';

import { FindSamplesResult } from '../../application/query/FindSamplesResult';

class Sample {
  @ApiProperty({ example: 1 })
  readonly id: number;
}

export class FindSamplesResponseDto extends FindSamplesResult {
  @ApiProperty({ type: [Sample] })
  readonly samples: Sample[];
}
