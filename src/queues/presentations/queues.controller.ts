import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { createResponse } from '../../libs/response';
import { CreateQueueDto, GetQueueDto } from './dto/queue.dto';
import { QueueResponseDto } from './presenter/queue.response.dto';
import { QueuesService } from '../application/queues.service';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @ApiBody({ type: CreateQueueDto })
  @ApiResponse({ type: QueueResponseDto, status: 201 })
  @ApiOperation({ summary: '대기열 생성' })
  @Post()
  async createQueue(@Body() body: CreateQueueDto): Promise<QueueResponseDto> {
    const { userId, eventId } = body;
    const result = await this.queuesService.post(userId, eventId);
    return await createResponse(QueueResponseDto, result);
  }

  @ApiResponse({ type: QueueResponseDto, status: 200 })
  @ApiOperation({ summary: '대기열 조회' })
  @Get('users/:userId/events/:eventId')
  async getQueue(@Param() param: GetQueueDto): Promise<QueueResponseDto> {
    const { userId, eventId } = param;
    const result = await this.queuesService.getByUserIdAndEventId(userId, eventId);
    return await createResponse(QueueResponseDto, result);
  }
}
