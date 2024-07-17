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
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsUUID, ValidateNested } from 'class-validator';

@Entity({ name: 'queue' })
export class QueueEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsUUID()
  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Expose()
  @IsEnum(QueueStatusEnum)
  @Column({
    type: 'enum',
    name: 'status',
    enum: QueueStatusEnum,
  })
  status: QueueStatusEnum;

  @Expose()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  @IsDate()
  @DeleteDateColumn()
  deletedAt: Date;

  @Expose()
  @ValidateNested()
  @ManyToOne(() => EventEntity, (event) => event.queue)
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  event: EventEntity;
  @Expose()
  @IsNumber()
  @Column('int', { name: 'eventId' })
  eventId: number;
}
