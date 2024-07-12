import { Queue, QueueRequestProps } from '../../domain/models/queues.model';
import { QueueEntity } from '../entities';

export class QueueMapper {
  static toEntity(props: QueueRequestProps): QueueEntity {
    const entity: QueueEntity = new QueueEntity();

    Object.assign(
      entity,
      props.userId ? { userId: props.userId } : null,
      props.eventId ? { eventId: props.eventId } : null,
      props.status ? { status: props.status } : null,
    );

    return entity;
  }

  static toDomain(entity: QueueEntity): Queue {
    const queue: Queue = new Queue();

    Object.assign(
      queue,
      entity.id ? { id: queue.userId } : null,
      entity.userId ? { userId: queue.userId } : null,
      entity.eventId ? { eventId: queue.eventId } : null,
      entity.status ? { eventId: queue.status } : null,
      entity.createdAt ? { eventId: queue.createdAt } : null,
      entity.updatedAt ? { eventId: queue.updatedAt } : null,
      entity.deletedAt ? { eventId: queue.deletedAt } : null,
    );

    return queue;
  }
}
