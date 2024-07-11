import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QueueStatusEnum } from '../../../libs/types';
import { EventEntity } from '../../../events/infrastructure/entities';

@Entity({ name: 'queue' })
export class QueueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Column({
    type: 'enum',
    name: 'status',
    enum: QueueStatusEnum,
  })
  status: QueueStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => EventEntity, (event) => event.queue)
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  event: EventEntity;
  @Column('int', { name: 'eventId' })
  eventId: number;
}
