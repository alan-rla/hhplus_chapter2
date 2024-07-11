import { Queue, QueueGetProps, QueuePostProps } from '../../domain/models/queue.model';
import { QueueEntity } from '../entities';

export class QueueMapper {
  static toPostEntity(props: QueuePostProps): QueueEntity {
    const entity: QueueEntity = new QueueEntity();

    entity.userId = props.userId;
    entity.eventId = props.eventId;
    entity.status = props.status;

    return entity;
  }

  static toGetEntity(props: QueueGetProps): QueueEntity {
    const entity: QueueEntity = new QueueEntity();

    entity.userId = props.userId;
    entity.eventId = props.eventId;

    return entity;
  }

  static toDomain(entity: QueueEntity): Queue {
    const queue: Queue = new Queue();

    queue.id = entity.id;
    queue.userId = entity.userId;
    queue.eventId = entity.eventId;
    queue.status = entity.status;
    queue.createdAt = entity.createdAt;
    queue.updatedAt = entity.updatedAt;
    queue.deletedAt = entity.deletedAt;

    return queue;
  }
}
