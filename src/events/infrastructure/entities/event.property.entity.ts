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
import { Expose } from 'class-transformer';
import { IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';

@Entity({ name: 'eventProperty' })
export class EventPropertyEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsString()
  @Column('varchar', { name: 'location' })
  location: string;

  @Expose()
  @IsDate()
  @Column('datetime', { name: 'eventDate' })
  eventDate: Date;

  @Expose()
  @IsDate()
  @Column('datetime', { name: 'bookStartDate' })
  bookStartDate: Date;

  @Expose()
  @IsDate()
  @Column('datetime', { name: 'bookEndDate' })
  bookEndDate: Date;

  @Expose()
  @IsNumber()
  @Column('int', { name: 'seatCount' })
  seatCount: number;

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
  @OneToOne(() => EventEntity, (event) => event.eventProperty)
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  event: EventEntity;
  @Expose()
  @IsNumber()
  @Column('int', { name: 'eventId' })
  eventId: number;

  @Expose()
  @ValidateNested()
  @OneToMany(() => SeatEntity, (seat) => seat.eventProperty)
  seat: SeatEntity[];
}
