import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper } from '@src/libs/mappers';
import { PayReservationDto } from '@src/presentations/payments/payments.dto';
import { PaymentsFacade } from '@src/applications/payments/payments.facade';
import { ReservationResponse } from '@src/presentations/reservations/reservations.response';
import { PointLockGuard } from '@src/libs/guards/queue.guard';
import { User } from '@src/libs/decorators/users.decorator';
import { GetUserDto } from '@src/presentations/users/users.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsFacade: PaymentsFacade) {}

  @UseGuards(PointLockGuard)
  @ApiResponse({ type: ReservationResponse })
  @ApiOperation({ summary: '예약한 좌석 결제' })
  @Put('seats/:seatId/reservations/:reservationId')
  async payReservation(@Param() param: PayReservationDto, @User() user: GetUserDto): Promise<ReservationResponse> {
    const result = await this.paymentsFacade.payReservation(param.reservationId, param.seatId, user.userId);
    return Mapper.classTransformer(ReservationResponse, result);
  }
}
