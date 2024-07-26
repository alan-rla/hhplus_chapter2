import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper } from '@src/libs/mappers';
import { SeatsFacade } from '@src/applications/seats/seats.facade';
import { GetSeatsDto } from '@src/presentations/seats/seats.dto';
import { SeatResponse } from '@src/presentations/seats/seats.response';
import { User } from '@src/libs/decorators/users.decorator';
import { GetUserDto } from '@src/presentations/users/users.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsFacade: SeatsFacade) {}

  @ApiResponse({ type: SeatResponse, isArray: true })
  @ApiOperation({ summary: '공연 날짜 하나의 좌석 조회' })
  @Get('eventProperties/:eventPropertyId')
  async getSeats(@Param() param: GetSeatsDto, @User() user: GetUserDto): Promise<SeatResponse[]> {
    const result = await this.seatsFacade.getSeatsByEventPropertyId(param.eventPropertyId, user.userId);
    return Promise.all(result.map(async (entity) => await Mapper.classTransformer(SeatResponse, entity)));
  }
}
