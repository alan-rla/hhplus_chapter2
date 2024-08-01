import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper } from '@src/libs/mappers';
import { EventPropertyResponse, EventResponse } from '@src/presentations/events/events.response';
import { GetEventPropertyDto } from '@src/presentations/events/events.dto';
import { EventsFacade } from '@src/applications/events/events.facade';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsFacade: EventsFacade) {}

  @ApiResponse({ type: EventResponse, isArray: true })
  @ApiOperation({ summary: '공연 전체 조회' })
  @Get()
  async getEvents(): Promise<EventResponse[]> {
    const result = await this.eventsFacade.getAllEvents();
    return result.map((entity) => Mapper.classTransformer(EventResponse, entity));
  }

  @ApiResponse({ type: EventPropertyResponse, isArray: true })
  @ApiOperation({ summary: '공연 속성 조회' })
  @Get(':eventId/properties')
  async getEventProperties(@Param() param: GetEventPropertyDto): Promise<EventPropertyResponse[]> {
    const result = await this.eventsFacade.getEventPropertiesByEventId(param.eventId);
    return result.map((entity) => Mapper.classTransformer(EventPropertyResponse, entity));
  }
}
