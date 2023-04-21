import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class SampleRequestDTO {
  @IsNumber()
  @Min(1)
  @ApiProperty({ minimum: 1, example: 1 })
  readonly id: number;

  @ApiProperty()
  readonly content: string | null;
}
