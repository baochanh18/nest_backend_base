import {
  Body,
  CacheInterceptor,
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

import { FindSamplesRequestQueryString } from 'src/sample/interface/dto/FindSamplesRequestQueryString';
import { SampleRequestDTO } from './dto/SampleRequestDTO';
import { FindSampleByIdRequestParam } from 'src/sample/interface/dto/FindSampleByIdRequestParam';
import { FindSampleByIdResponseDTO } from 'src/sample/interface/dto/FindSampleByIdResponseDTO';
import { FindSamplesResponseDto } from 'src/sample/interface/dto/FindSamplesResponseDto';
import { ResponseDescription } from 'src/sample/interface/ResponseDescription';

import { SampleCommand } from 'src/sample/application/command/SampleCommand';
import { FindSampleByIdQuery } from 'src/sample/application/query/FindSampleByIdQuery';
import { FindSamplesQuery } from 'src/sample/application/query/FindSamplesQuery';

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
