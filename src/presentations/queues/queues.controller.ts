import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueuesFacade } from '@src/applications/queues/queues.facade';
import { Mapper } from '@src/libs/mappers';
import { CreateQueueDto, GetQueueDto } from './queues.dto';
import { QueueResponse } from './queues.response.dto';
import { QueueTimeLeft } from '@src/domains/queues/queues.model';

@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesFacade: QueuesFacade) {}

  @ApiBody({ type: CreateQueueDto })
  @ApiResponse({ type: QueueResponse, status: 201 })
  @ApiOperation({ summary: '대기열 생성' })
  @Post()
  async joinWaitingQueue(@Body() body: CreateQueueDto) {
    const queue = await this.queuesFacade.joinWaitingQueue(body.userId);
    return Mapper.classTransformer(QueueResponse, { queue });
  }

  @ApiResponse({ type: QueueTimeLeft, status: 200 })
  @ApiOperation({ summary: '대기열 조회' })
  @Get('users/:userId')
  async getTimeLeftInWaitingQueue(@Param() param: GetQueueDto): Promise<QueueTimeLeft> {
    const result = await this.queuesFacade.getTimeLeftInWaitingQueue(param.userId);
    return Mapper.classTransformer(QueueTimeLeft, result);
  }

  private isActivatorRunning = false;
  @Cron('0 */1 * * * *', { name: 'queueActivateManager' })
  async tokenActivateManager(): Promise<void> {
    if (this.isActivatorRunning) {
      Logger.log('task already running');
      return;
    }

    this.isActivatorRunning = true;
    await this.queuesFacade.tokenActivateManager();
    this.isActivatorRunning = false;
    return;
  }

  private isExpirerRunning = false;
  @Cron('0 */5 * * * *', { name: 'queueExpireManager' })
  async tokenExpireManager(): Promise<void> {
    if (this.isExpirerRunning) {
      Logger.log('task already running');
      return;
    }

    this.isExpirerRunning = true;
    await this.queuesFacade.tokenExpireManager();
    this.isExpirerRunning = false;
    return;
  }
}
