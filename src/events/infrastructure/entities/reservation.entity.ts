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
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';

@Entity({ name: 'reservation' })
export class ReservationEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsUUID()
  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Expose()
  @IsEnum(ReservationStatusEnum)
  @Column({
    type: 'enum',
    name: 'status',
    enum: ReservationStatusEnum,
  })
  status: ReservationStatusEnum;

  @Expose()
  @IsNumber()
  @Column('int', { name: 'eventId' })
  eventId: number;

  @Expose()
  @IsString()
  @Column('varchar', { name: 'eventName' })
  eventName: string;

  @Expose()
  @IsNumber()
  @Column('int', { name: 'eventPropertyId' })
  eventPropertyId: number;

  @Expose()
  @IsDate()
  @Column('datetime', { name: 'eventDate' })
  eventDate: Date;

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
  @ManyToOne(() => SeatEntity, (seat) => seat.reservation)
  @JoinColumn([{ name: 'seatId', referencedColumnName: 'id' }])
  seat: SeatEntity;
  @Expose()
  @IsNumber()
  @Column('int', { name: 'seatId' })
  seatId: number;

  @Expose()
  @ValidateNested()
  @OneToMany(() => PaymentEntity, (payment) => payment.reservation)
  payment: PaymentEntity[];
}
