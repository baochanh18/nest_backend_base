import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseInterceptors,
  HttpStatus,
  NotFoundException,
  Headers,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  // ApiUnauthorizedResponse,
  // ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

// import { Auth, AuthorizedHeader } from 'libs/Auth';

import { FindSamplesRequestQueryString } from './dto/FindSamplesRequestQueryString';
import { SampleRequestDTO } from './dto/SampleRequestDTO';
import { FindSampleByIdRequestParam } from './dto/FindSampleByIdRequestParam';
import { FindSampleByIdResponseDTO } from './dto/FindSampleByIdResponseDTO';
import { FindSamplesResponseDto } from './dto/FindSamplesResponseDto';
import { ResponseDescription } from './ResponseDescription';

import { SampleCommand } from '../application/command/SampleCommand';
import { FindSampleByIdQuery } from '../application/query/FindSampleByIdQuery';
import { FindSamplesQuery } from '../application/query/FindSamplesQuery';

// import { ErrorMessage } from 'src/sample/domain/ErrorMessage';

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
    const command = new SampleCommand(body.id);
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

  // @Auth()
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
    // @Headers() header: AuthorizedHeader,
    @Param() param: FindSampleByIdRequestParam,
  ): Promise<FindSampleByIdResponseDTO> {
    // if (header.accountId !== param.accountId)
    //   throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    return this.queryBus.execute(new FindSampleByIdQuery(param.id));
  }
}
