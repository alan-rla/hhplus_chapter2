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
import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';

@Entity({ name: 'event' })
export class EventEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsString()
  @Column('varchar', { name: 'name' })
  name: string;

  @Expose()
  @IsNumber()
  @Column('int', { name: 'starId' })
  starId: number;

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
  @OneToOne(() => EventPropertyEntity, (eventProperty) => eventProperty.event)
  eventProperty: EventPropertyEntity;

  @Expose()
  @ValidateNested()
  @OneToMany(() => QueueEntity, (queue) => queue.event)
  queue: QueueEntity;
}
