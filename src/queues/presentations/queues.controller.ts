import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { createResponse } from '../../libs/response';
import { CreateQueueDto, GetQueueDto } from './dto/queues.dto';
import { QueueResponseDto } from './presenter/queues.response.dto';
import { QueuesService } from '../application/queues.service';
import { Cron } from '@nestjs/schedule';

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

  private isActivatorRunning = false;
  @Cron('*/10 * * * * *', { name: 'queueActivateManager' })
  async queueActivateManager(): Promise<void> {
    if (this.isActivatorRunning) {
      Logger.log('task already running');
      return;
    }

    this.isActivatorRunning = true;
    await this.queuesService.queueActivateManager();
    this.isActivatorRunning = false;
    return;
  }

  private isExpirerRunning = false;
  @Cron('*/10 * * * * *', { name: 'queueExpireManager' })
  async queueExpireManager(): Promise<void> {
    if (this.isExpirerRunning) {
      Logger.log('task already running');
      return;
    }

    this.isExpirerRunning = true;
    await this.queuesService.queueExpireManager();
    this.isExpirerRunning = false;
    return;
  }
}
