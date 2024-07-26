import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueuesFacade } from '@src/applications/queues/queues.facade';
import { Mapper } from '@src/libs/mappers';
import { CreateQueueDto, GetQueueDto } from './queues.dto';
import { QueueResponseDto } from './queues.response.dto';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesFacade: QueuesFacade) {}

  @ApiBody({ type: CreateQueueDto })
  @ApiResponse({ type: QueueResponseDto, status: 201 })
  @ApiOperation({ summary: '대기열 생성' })
  @Post()
  async createQueue(@Body() body: CreateQueueDto) {
    const result = await this.queuesFacade.post(body.userId, body.eventId);
    return await Mapper.classTransformer(QueueResponseDto, result);
  }

  @ApiResponse({ type: QueueResponseDto, status: 200 })
  @ApiOperation({ summary: '대기열 조회' })
  @Get('users/:userId/events/:eventId')
  async getQueue(@Param() param: GetQueueDto): Promise<QueueResponseDto> {
    const result = await this.queuesFacade.getQueueByUserIdAndEventId(param.userId, param.eventId);
    return await Mapper.classTransformer(QueueResponseDto, result);
  }

  // private isActivatorRunning = false;
  // @Cron('0 */10 * * * *', { name: 'queueActivateManager' })
  // async queueActivateManager(): Promise<void> {
  //   if (this.isActivatorRunning) {
  //     Logger.log('task already running');
  //     return;
  //   }

  //   this.isActivatorRunning = true;
  //   await this.queuesFacade.queueActivateManager();
  //   this.isActivatorRunning = false;
  //   return;
  // }

  private isExpirerRunning = false;
  @Cron('0 */5 * * * *', { name: 'queueExpireManager' })
  async queueExpireManager(): Promise<void> {
    if (this.isExpirerRunning) {
      Logger.log('task already running');
      return;
    }

    this.isExpirerRunning = true;
    await this.queuesFacade.queueExpireManager();
    this.isExpirerRunning = false;
    return;
  }
}
