import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { GetEventDatesDto } from './dto/get.event.dates';
import dayjs from 'dayjs';
import { GetEventDateSeatsDto } from './dto/get.event.date.seats';
import { PostSeatReservationDto } from './dto/post.seat.reservation';
import { SelectByRservationIdDto } from 'src/users/presentations/dto/select.by.reservation.id.dto';

@Controller('events')
export class EventsController {
  @Get(':eventId/dates')
  async getEventDates(@Param() param: GetEventDatesDto) {
    const { eventId } = param;
    return {
      success: true,
      data: [
        {
          id: 1,
          eventId,
          eventDate: dayjs(Date.now()).toDate(),
          seatCount: 50,
          bookStartDate: dayjs(Date.now()).toDate(),
          bookEndDate: dayjs(Date.now()).toDate(),
          createdAt: dayjs(Date.now()).toDate(),
          updatedAt: dayjs(Date.now()).toDate(),
          deletedAt: null,
        },
      ],
    };
  }

  @Get('properties/:propertyId/seats')
  async getEventDateSeats(@Param() param: GetEventDateSeatsDto) {
    const { propertyId } = param;
    return {
      success: true,
      data: [
        {
          id: 1,
          seatNumber: 1,
          status: 'AVAILABLE',
          propertyId,
          seatProperty: {
            id: 1,
            name: '스탠딩',
            price: 100000,
          },
        },
      ],
    };
  }

  @Post('seats/reservation')
  async postSeatReservation(@Body() body: PostSeatReservationDto) {
    const { seatId, userId } = body;
    return {
      success: true,
      data: {
        id: 1,
        seatId,
        userId,
        status: 'RESERVED',
        eventId: 1,
        eventName: '공연 이름',
        eventPropertyId: 1,
        eventDate: dayjs(Date.now()).toDate(),
        price: 50000,
      },
    };
  }

  @Put('reservations/:reservationId/pay')
  async paySeatReservation(@Param() param: SelectByRservationIdDto) {
    const { reservationId } = param;
    return {
      success: true,
      data: {
        id: reservationId,
        seatId: 1,
        userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
        status: 'PAID',
        eventId: 1,
        eventName: '공연 이름',
        eventPropertyId: 1,
        eventDate: dayjs(Date.now()).toDate(),
        price: 50000,
      },
    };
  }
}
