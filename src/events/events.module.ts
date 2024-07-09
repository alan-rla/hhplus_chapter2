import { Module } from '@nestjs/common';
import { EventsController } from './presentations/events.controller';

@Module({
  controllers: [EventsController],
})
export class EventsModule {}
