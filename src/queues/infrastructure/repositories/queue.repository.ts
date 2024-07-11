import { Injectable } from '@nestjs/common';
import { QueuesRepository } from '../../domain/repositories/queue.repository';
import { QueueEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Queue } from '../../domain/models/queue.model';
import { QueueMapper } from '../mappers/queue.mapper';
import { QueueStatusEnum } from '../../../libs/types';

@Injectable()
export class QueuesRepositoryImpl implements QueuesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async post(userId: string, eventId: number): Promise<Queue> {
    const status = QueueStatusEnum.STANDBY;
    const entity = QueueMapper.toPostEntity({ userId, eventId, status });
    const queue = await this.dataSource.manager.save(entity);
    return QueueMapper.toDomain(queue);
  }

  async getByUserIdAndEventId(userId: string, eventId: any): Promise<Queue> {
    const entity = QueueMapper.toGetEntity({ userId, eventId });
    const queue = await this.dataSource.manager.findOne(QueueEntity, { where: entity });
    return QueueMapper.toDomain(queue);
  }
}
