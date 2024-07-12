import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { SeatEntity } from './seat.entity';
import { PaymentEntity } from './payment.entity';
import { ReservationStatusEnum } from '../../../libs/types';

@Entity({ name: 'reservation' })
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Column({
    type: 'enum',
    name: 'type',
    enum: ReservationStatusEnum,
  })
  type: ReservationStatusEnum;

  @Column('int', { name: 'eventId' })
  eventId: string;

  @Column('varchar', { name: 'eventName' })
  eventName: string;

  @Column('int', { name: 'eventPropertyId' })
  eventPropertyId: string;

  @Column('varchar', { name: 'eventDate' })
  eventDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => SeatEntity, (seat) => seat.reservation)
  @JoinColumn([{ name: 'seatId', referencedColumnName: 'id' }])
  seat: SeatEntity;
  @Column('int', { name: 'seatId' })
  seatId: number;

  @OneToMany(() => PaymentEntity, (payment) => payment.reservation)
  payment: PaymentEntity[];
}
