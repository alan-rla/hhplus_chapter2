import { Body, Controller, Post } from '@nestjs/common';
import { CreateQueueDto } from './dto/create.queue.dto';
import dayjs from 'dayjs';

@Controller('queues')
export class QueuesController {
  @Post()
  async createQueue(@Body() body: CreateQueueDto) {
    const { userId } = body;
    return {
      success: true,
      data: { id: 1, userId, eventId: 1, status: 'STAND_BY', createdAt: dayjs(Date.now()).toDate() },
    };
  }
}
