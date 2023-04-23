import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsString, ValidateIf } from 'class-validator';

export class SampleRequestDTO {
  @IsNumber()
  @Min(1)
  @ApiProperty({ minimum: 1, example: 1 })
  readonly id: number;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  @ApiProperty({ example: 'test' })
  readonly content: string | null;
}
