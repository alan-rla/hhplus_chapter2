import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetEventDatesDto, GetEventDateSeatsDto, PostSeatReservationDto, PutReservationDto } from './dto/events.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventDatesResponseDto, EventSeatsResponseDto, ReservationResponseDto } from './presenter/events.response.dto';
import { Mapper } from '../../libs/mappers';
import { EventsService } from '../application/events.service';
import { QueueGuard } from '../../libs/guards/queue.guard';
import { EventPropertyProps, PaymentProps, ReservationProps, SeatProps } from '../domain/models/events.model';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(QueueGuard)
  @ApiResponse({ type: EventDatesResponseDto, isArray: true })
  @ApiOperation({ summary: '공연 날짜 조회' })
  @Get(':eventId/dates')
  async getEventDates(@Param() param: GetEventDatesDto): Promise<EventDatesResponseDto[]> {
    const args = await Mapper.classTransformer(EventPropertyProps, param);
    const result = await this.eventsService.getEventDates(args);
    return Promise.all(result.map(async (entity) => await Mapper.classTransformer(EventDatesResponseDto, entity)));
  }

  @UseGuards(QueueGuard)
  @ApiResponse({ type: EventSeatsResponseDto, isArray: true })
  @ApiOperation({ summary: '공연 날짜 하나의 좌석 조회' })
  @Get('properties/:eventPropertyId/seats')
  async getSeats(@Param() param: GetEventDateSeatsDto): Promise<EventSeatsResponseDto[]> {
    const args = await Mapper.classTransformer(SeatProps, param);
    const result = await this.eventsService.getSeats(args);
    return Promise.all(result.map(async (entity) => await Mapper.classTransformer(EventSeatsResponseDto, entity)));
  }

  @UseGuards(QueueGuard)
  @ApiBody({ type: PostSeatReservationDto })
  @ApiResponse({ type: ReservationResponseDto })
  @ApiOperation({ summary: '좌석 예약' })
  @Post('seats/reservation')
  async postSeatReservation(@Body() body: PostSeatReservationDto): Promise<ReservationResponseDto> {
    const args = await Mapper.classTransformer(ReservationProps, body);
    const result = await this.eventsService.reserveSeat(args);
    return await Mapper.classTransformer(ReservationResponseDto, result);
  }

  @UseGuards(QueueGuard)
  @ApiResponse({ type: ReservationResponseDto })
  @ApiOperation({ summary: '예약한 좌석 결제' })
  @Put('reservations/:reservationId/users/:userId/pay')
  async putSeatReservation(@Param() param: PutReservationDto): Promise<ReservationResponseDto> {
    const args = await Mapper.classTransformer(PaymentProps, param);
    const result = await this.eventsService.paySeatReservation(args);
    return await Mapper.classTransformer(ReservationResponseDto, result);
  }
}
