import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { SeatEntity } from './seat.entity';

import { IsDate, IsNumber, IsString, ValidateIf, ValidateNested } from 'class-validator';

@Entity({ name: 'eventProperty' })
export class EventPropertyEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column('varchar', { name: 'location' })
  location: string;

  @IsDate()
  @Column('datetime', { name: 'eventDate' })
  eventDate: Date;

  @IsDate()
  @Column('datetime', { name: 'bookStartDate' })
  bookStartDate: Date;

  @IsDate()
  @Column('datetime', { name: 'bookEndDate' })
  bookEndDate: Date;

  @IsNumber()
  @Column('int', { name: 'seatCount' })
  seatCount: number;

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
  @OneToOne(() => EventEntity, (event) => event.eventProperty)
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  event: EventEntity;

  @IsNumber()
  @Column('int', { name: 'eventId' })
  eventId: number;

  @ValidateNested()
  @OneToMany(() => SeatEntity, (seat) => seat.eventProperty)
  seat: SeatEntity[];
}
