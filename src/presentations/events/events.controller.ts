import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Mapper } from '@src/libs/mappers';
import { QueueGuard } from '@src/libs/guards/queue.guard';
import { EventPropertyResponse } from '@src/presentations/events/events.response';
import { GetEventPropertyDto } from '@src/presentations/events/events.dto';
import { EventsFacade } from '@src/applications/events/events.facade';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsFacade: EventsFacade) {}

  @UseGuards(QueueGuard)
  @ApiResponse({ type: EventPropertyResponse, isArray: true })
  @ApiOperation({ summary: '공연 날짜 조회' })
  @Get(':eventId/properties')
  async getEventProperties(@Param() param: GetEventPropertyDto): Promise<EventPropertyResponse[]> {
    const result = await this.eventsFacade.getEventProperties(param.eventId);
    return Promise.all(result.map(async (entity) => await Mapper.classTransformer(EventPropertyResponse, entity)));
  }
}
