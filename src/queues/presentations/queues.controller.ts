import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateQueueDto, GetQueueDto } from './dto/queue.dto';
import dayjs from 'dayjs';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueueResponseDto } from './presenter/queue.response.dto';

@Controller('queues')
export class QueuesController {
  @ApiBody({ type: CreateQueueDto })
  @ApiResponse({ type: QueueResponseDto, status: 201 })
  @ApiOperation({ summary: '대기열 생성' })
  @Post()
  async createQueue(@Body() body: CreateQueueDto) {
    const { userId, eventId } = body;
    return await QueueResponseDto.fromDomain({
      id: 1,
      userId,
      eventId,
      status: 'STANDBY',
      createdAt: dayjs(Date.now()).toDate(),
    });
  }

  @ApiResponse({ type: QueueResponseDto, status: 200 })
  @ApiOperation({ summary: '대기열 조회' })
  @Get('users/:userId/events/:eventId')
  async getQueue(@Param() param: GetQueueDto) {
    const { userId, eventId } = param;
    return await QueueResponseDto.fromDomain({
      id: 1,
      userId,
      eventId,
      status: 'STANDBY',
      createdAt: dayjs(Date.now()).toDate(),
    });
  }
}
