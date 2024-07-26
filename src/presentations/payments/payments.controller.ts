import { Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper } from '@src/libs/mappers';
import { PayReservationDto } from '@src/presentations/payments/payments.dto';
import { PaymentsFacade } from '@src/applications/payments/payments.facade';
import { ReservationResponse } from '@src/presentations/reservations/reservations.response';
import { PointLockGuard } from '@src/libs/guards/lock.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsFacade: PaymentsFacade) {}

  @UseGuards(PointLockGuard)
  @ApiResponse({ type: ReservationResponse })
  @ApiOperation({ summary: '예약한 좌석 결제' })
  @Put('reservations/:reservationId/users/:userId')
  async payReservation(@Param() param: PayReservationDto): Promise<ReservationResponse> {
    const result = await this.paymentsFacade.payReservation(param.reservationId, param.userId);
    return await Mapper.classTransformer(ReservationResponse, result);
  }
}
