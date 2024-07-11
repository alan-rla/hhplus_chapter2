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

@Entity({ name: 'eventProperty' })
export class EventPropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'location' })
  location: string;

  @Column('datetime', { name: 'eventDate' })
  eventDate: Date;

  @Column('datetime', { name: 'bookStartDate' })
  bookStartDate: Date;

  @Column('datetime', { name: 'bookEndDate' })
  bookEndDate: Date;

  @Column('int', { name: 'seatCount' })
  seatCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => EventEntity, (event) => event.eventProperty)
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  event: EventEntity;
  @Column('int', { name: 'eventId' })
  eventId: number;

  @OneToMany(() => SeatEntity, (seat) => seat.eventProperty)
  seat: SeatEntity[];
}
