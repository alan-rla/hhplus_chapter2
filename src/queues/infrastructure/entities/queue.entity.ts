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

import { IsDate, IsEnum, IsNumber, IsUUID, ValidateIf, ValidateNested } from 'class-validator';

@Entity({ name: 'queue' })
export class QueueEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsUUID()
  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @IsEnum(QueueStatusEnum)
  @Column({
    type: 'enum',
    name: 'status',
    enum: QueueStatusEnum,
  })
  status: QueueStatusEnum;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @IsDate()
  @ValidateIf((o) => o.deletedAt !== null)
  @DeleteDateColumn()
  deletedAt: Date;

  @ValidateNested()
  @ManyToOne(() => EventEntity, (event) => event.queue)
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  event: EventEntity;

  @IsNumber()
  @Column('int', { name: 'eventId' })
  eventId: number;
}
