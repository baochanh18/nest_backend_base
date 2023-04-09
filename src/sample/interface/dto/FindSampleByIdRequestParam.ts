import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class FindSampleByIdRequestParam {
  @IsAlphanumeric()
  @Length(32, 32)
  @ApiProperty({ example: 1 })
  readonly id: number;
}
