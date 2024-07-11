import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import dayjs from 'dayjs';
import { GetEventDatesDto, GetEventDateSeatsDto, PostSeatReservationDto, PutReservationDto } from './dto/events.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventDatesResponseDto, EventSeatsResponseDto, ReservationResponseDto } from './presenter/events.response.dto';
import { createResponse } from '../../libs/response';
import { ReservationStatusEnum, SeatStatusEnum } from '../../libs/types';

@Controller('events')
export class EventsController {
  @ApiResponse({ type: EventDatesResponseDto, isArray: true })
  @ApiOperation({ summary: '공연 날짜 조회' })
  @Get(':eventId/dates')
  async getEventDates(@Param() param: GetEventDatesDto): Promise<EventDatesResponseDto[]> {
    const { eventId } = param;
    const result = [
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
    ];
    return Promise.all(result.map(async (entity) => await createResponse(EventDatesResponseDto, entity)));
  }

  @ApiResponse({ type: EventSeatsResponseDto, isArray: true })
  @ApiOperation({ summary: '공연 날짜 하나의 좌석 조회' })
  @Get('properties/:propertyId/seats')
  async getEventDateSeats(@Param() param: GetEventDateSeatsDto): Promise<EventSeatsResponseDto[]> {
    const { propertyId } = param;
    const result = [
      {
        id: 1,
        seatNumber: 1,
        status: SeatStatusEnum.AVAILABLE,
        propertyId,
        seatProperty: {
          id: 1,
          name: '스탠딩',
          price: 100000,
        },
      },
    ];
    return Promise.all(result.map(async (entity) => await createResponse(EventSeatsResponseDto, entity)));
  }

  @ApiBody({ type: PostSeatReservationDto })
  @ApiResponse({ type: ReservationResponseDto })
  @ApiOperation({ summary: '좌석 예약' })
  @Post('seats/reservation')
  async postSeatReservation(@Body() body: PostSeatReservationDto): Promise<ReservationResponseDto> {
    const { seatId, userId } = body;
    const result = {
      id: 1,
      seatId,
      userId,
      status: ReservationStatusEnum.RESERVED,
      eventId: 1,
      eventName: '공연 이름',
      eventPropertyId: 1,
      eventDate: dayjs(Date.now()).toDate(),
      price: 50000,
    };
    return await createResponse(ReservationResponseDto, result);
  }

  @ApiResponse({ type: ReservationResponseDto })
  @ApiOperation({ summary: '예약한 좌석 결제' })
  @Put('reservations/:reservationId/pay')
  async putSeatReservation(@Param() param: PutReservationDto): Promise<ReservationResponseDto> {
    const { reservationId } = param;
    const result = {
      id: reservationId,
      seatId: 1,
      userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
      status: ReservationStatusEnum.PAID,
      eventId: 1,
      eventName: '공연 이름',
      eventPropertyId: 1,
      eventDate: dayjs(Date.now()).toDate(),
      price: 50000,
    };
    return await createResponse(ReservationResponseDto, result);
  }
}
