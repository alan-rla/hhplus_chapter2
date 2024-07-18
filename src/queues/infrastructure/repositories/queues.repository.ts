import { Injectable } from '@nestjs/common';
import { QueuesRepository } from '../../domain/repositories/queues.repository';
import { QueueEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { Queue } from '../../domain/models/queues.model';
import { QueueStatusEnum } from '../../../libs/types';
import { Mapper } from '../../../libs/mappers';

@Injectable()
export class QueuesRepositoryImpl implements QueuesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async post(userId: string, eventId: number): Promise<Queue> {
    const status = QueueStatusEnum.STANDBY;
    const entity = await Mapper.classTransformer(QueueEntity, { userId, eventId, status });
    const queue = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(QueueEntity)
      .values(entity)
      .returning('*')
      .execute();

    return await Mapper.classTransformer(Queue, queue.raw[0]);
  }

  async getByUserIdAndEventId(userId: string, eventId: number): Promise<Queue> {
    const entity = await Mapper.classTransformer(QueueEntity, { userId, eventId });
    const queue = await this.dataSource.getRepository(QueueEntity).findOne({ where: entity });
    return await Mapper.classTransformer(Queue, queue);
  }

  async getQueuesByEventId(eventId: number, status: QueueStatusEnum): Promise<[Queue[], number]> {
    const entity = await Mapper.classTransformer(QueueEntity, { eventId, status });
    const queues = await this.dataSource.manager.findAndCount(QueueEntity, {
      where: entity,
      order: { createdAt: 'ASC' },
    });
    const result = await Promise.all(queues[0].map(async (entity) => await Mapper.classTransformer(Queue, entity)));
    const count = queues[1];
    return [result, count];
  }

  async putQueueStatus(ids: number[], status: QueueStatusEnum): Promise<boolean> {
    const queues = await this.dataSource.getRepository(QueueEntity).update({ id: In(ids) }, { status });
    return queues.affected ? true : false;
  }
}
