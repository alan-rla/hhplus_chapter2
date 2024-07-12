import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GetEventDatesDto, GetEventDateSeatsDto, PostSeatReservationDto, PutReservationDto } from './dto/events.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EventDatesResponseDto, EventSeatsResponseDto, ReservationResponseDto } from './presenter/events.response.dto';
import { createResponse } from '../../libs/response';
import { EventsService } from '../application/events.service';
import { QueueGuard } from '../../libs/guards/queue.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(QueueGuard)
  @ApiResponse({ type: EventDatesResponseDto, isArray: true })
  @ApiOperation({ summary: '공연 날짜 조회' })
  @Get(':eventId/dates')
  async getEventDates(@Param() param: GetEventDatesDto): Promise<EventDatesResponseDto[]> {
    const { eventId } = param;
    const result = await this.eventsService.getEventDates(eventId);
    return Promise.all(result.map(async (entity) => await createResponse(EventDatesResponseDto, entity)));
  }

  @UseGuards(QueueGuard)
  @ApiResponse({ type: EventSeatsResponseDto, isArray: true })
  @ApiOperation({ summary: '공연 날짜 하나의 좌석 조회' })
  @Get('properties/:propertyId/seats')
  async getSeats(@Param() param: GetEventDateSeatsDto): Promise<EventSeatsResponseDto[]> {
    const { propertyId } = param;
    const result = await this.eventsService.getSeats(propertyId);
    return Promise.all(result.map(async (entity) => await createResponse(EventSeatsResponseDto, entity)));
  }

  @UseGuards(QueueGuard)
  @ApiBody({ type: PostSeatReservationDto })
  @ApiResponse({ type: ReservationResponseDto })
  @ApiOperation({ summary: '좌석 예약' })
  @Post('seats/reservation')
  async postSeatReservation(@Body() body: PostSeatReservationDto): Promise<ReservationResponseDto> {
    const { seatId, userId } = body;
    const result = await this.eventsService.reserveSeat(seatId, userId);
    return await createResponse(ReservationResponseDto, result);
  }

  @UseGuards(QueueGuard)
  @ApiResponse({ type: ReservationResponseDto })
  @ApiOperation({ summary: '예약한 좌석 결제' })
  @Put('reservations/:reservationId/users/:userId/pay')
  async putSeatReservation(@Param() param: PutReservationDto): Promise<ReservationResponseDto> {
    const { reservationId, userId } = param;
    const result = await this.eventsService.paySeatReservation(reservationId, userId);
    return await createResponse(ReservationResponseDto, result);
  }
}
