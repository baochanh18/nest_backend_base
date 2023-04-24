import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { FindSamplesRequestQueryString } from './dto/FindSamplesRequestQueryString';
import { SampleRequestDTO } from './dto/SampleRequestDTO';
import { FindSampleByIdRequestParam } from './dto/FindSampleByIdRequestParam';
import { FindSampleByIdResponseDTO } from './dto/FindSampleByIdResponseDTO';
import { FindSamplesResponseDto } from './dto/FindSamplesResponseDto';
import { ResponseDescription } from './ResponseDescription';

import { SampleCommand } from '../application/command/SampleCommand';
import { FindSampleByIdQuery } from '../application/query/FindSampleById/FindSampleByIdQuery';
import { FindSamplesQuery } from '../application/query/FindSamples/FindSamplesQuery';

@ApiTags('Samples')
@Controller()
export class SamplesController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @Post('samples')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async sample(@Body() body: SampleRequestDTO): Promise<void> {
    const command = new SampleCommand(body.id, body.content);
    await this.commandBus.execute(command);
  }

  @Get('samples')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseDescription.OK,
    type: FindSamplesResponseDto,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findSamples(
    @Query() querystring: FindSamplesRequestQueryString,
  ): Promise<FindSamplesResponseDto> {
    const query = new FindSamplesQuery(querystring);
    return { samples: await this.queryBus.execute(query) };
  }

  @Get('samples/:sampleId')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseDescription.OK,
    type: FindSampleByIdResponseDTO,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findSampleById(
    @Param() param: FindSampleByIdRequestParam,
  ): Promise<FindSampleByIdResponseDTO> {
    return this.queryBus.execute(new FindSampleByIdQuery(param.id));
  }
}
