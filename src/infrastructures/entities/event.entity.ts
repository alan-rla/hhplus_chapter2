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
import { IsDate, IsNumber, IsString, ValidateIf, ValidateNested } from 'class-validator';
import { QueueEntity } from '@src/infrastructures/entities/queue.entity';
import { EventPropertyEntity } from '@src/infrastructures/entities/event.property.entity';

@Entity({ name: 'event' })
export class EventEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column('varchar', { name: 'name' })
  name: string;

  @IsNumber()
  @Column('int', { name: 'starId' })
  starId: number;

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
  @OneToOne(() => EventPropertyEntity, (eventProperty) => eventProperty.event)
  eventProperty: EventPropertyEntity;

  @ValidateNested()
  @OneToMany(() => QueueEntity, (queue) => queue.event)
  queue: QueueEntity;
}
