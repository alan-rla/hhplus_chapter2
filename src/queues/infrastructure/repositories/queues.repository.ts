import { Injectable } from '@nestjs/common';
import { QueuesRepository } from '../../domain/repositories/queues.repository';
import { QueueEntity } from '../entities';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager, In } from 'typeorm';
import { Queue } from '../../domain/models/queues.model';
import { QueueMapper } from '../mappers/queues.mapper';
import { QueueStatusEnum } from '../../../libs/types';

@Injectable()
export class QueuesRepositoryImpl implements QueuesRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private entityManager: EntityManager,
  ) {}

  getManager(): EntityManager {
    return this.entityManager;
  }

  async post(userId: string, eventId: number): Promise<Queue> {
    const status = QueueStatusEnum.STANDBY;
    const entity = QueueMapper.toEntity({ userId, eventId, status });
    const queue = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(QueueEntity)
      .values(entity)
      .returning('*')
      .execute();

    return QueueMapper.toDomain(queue.raw[0]);
  }

  async getByUserIdAndEventId(
    userId: string,
    eventId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<Queue> {
    const entity = QueueMapper.toEntity({ userId, eventId });
    const queue = await (transactionalEntityManager ? transactionalEntityManager : this.getManager())
      .getRepository(QueueEntity)
      .findOne({ where: entity });

    return QueueMapper.toDomain(queue);
  }

  async getQueuesByEventId(eventId: number, status: QueueStatusEnum): Promise<[Queue[], number]> {
    const entity = QueueMapper.toEntity({ eventId, status });
    const queues = await this.dataSource.manager.findAndCount(QueueEntity, {
      where: entity,
      order: { createdAt: 'ASC' },
    });
    const result = queues[0].map((entity) => QueueMapper.toDomain(entity));
    const count = queues[1];
    return [result, count];
  }

  async putQueueStatus(
    ids: number[],
    status: QueueStatusEnum,
    transactionalEntityManager?: EntityManager,
  ): Promise<void> {
    await (transactionalEntityManager ? transactionalEntityManager : this.getManager())
      .getRepository(QueueEntity)
      .update({ id: In(ids) }, { status });
    return;
  }
}
