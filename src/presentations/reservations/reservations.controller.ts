import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper } from '@src/libs/mappers';
import { EventPropertyLockGuard } from '@src/libs/guards/queue.guard';
import { ReservationsFacade } from '@src/applications/reservations/reservations.facade';
import { PostReservationDto } from '@src/presentations/reservations/reservations.dto';
import { ReservationResponse } from '@src/presentations/reservations/reservations.response';

@Controller('reservations')
export class ReservationssController {
  constructor(private readonly reservationsFacade: ReservationsFacade) {}

  @UseGuards(EventPropertyLockGuard)
  @ApiBody({ type: PostReservationDto })
  @ApiResponse({ type: ReservationResponse })
  @ApiOperation({ summary: '좌석 예약' })
  @Post('seats')
  async postSeatReservation(@Body() body: PostReservationDto): Promise<ReservationResponse> {
    const result = await this.reservationsFacade.postReservation(
      body.seatId,
      body.eventPropertyId,
      body.eventId,
      body.userId,
    );
    return Mapper.classTransformer(ReservationResponse, result);
  }
}
