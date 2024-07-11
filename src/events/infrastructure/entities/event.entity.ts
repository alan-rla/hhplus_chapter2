import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventPropertyEntity } from './event.property.entity';
import { QueueEntity } from '../../../queues/infrastructure/entities';

@Entity({ name: 'event' })
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name' })
  name: string;

  @Column('int', { name: 'starId' })
  starId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => EventPropertyEntity, (eventProperty) => eventProperty.event)
  eventProperty: EventPropertyEntity;

  @OneToMany(() => QueueEntity, (queue) => queue.event)
  queue: QueueEntity;
}
