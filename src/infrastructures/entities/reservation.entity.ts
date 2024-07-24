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
import { ReservationStatusEnum } from '@src/libs/types';
import { IsDate, IsEnum, IsNumber, IsString, IsUUID, ValidateIf, ValidateNested } from 'class-validator';
import { SeatEntity } from '@src/infrastructures/entities/seat.entity';
import { PaymentEntity } from '@src/infrastructures/entities/payment.entity';

@Entity({ name: 'reservation' })
export class ReservationEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsUUID()
  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @IsEnum(ReservationStatusEnum)
  @Column({
    type: 'enum',
    name: 'status',
    enum: ReservationStatusEnum,
  })
  status: ReservationStatusEnum;

  @IsNumber()
  @Column('int', { name: 'eventId' })
  eventId: number;

  @IsString()
  @Column('varchar', { name: 'eventName' })
  eventName: string;

  @IsNumber()
  @Column('int', { name: 'eventPropertyId' })
  eventPropertyId: number;

  @IsDate()
  @Column('datetime', { name: 'eventDate' })
  eventDate: Date;

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
  @ManyToOne(() => SeatEntity, (seat) => seat.reservation)
  @JoinColumn([{ name: 'seatId', referencedColumnName: 'id' }])
  seat: SeatEntity;

  @IsNumber()
  @Column('int', { name: 'seatId' })
  seatId: number;

  @ValidateNested()
  @OneToMany(() => PaymentEntity, (payment) => payment.reservation)
  payment: PaymentEntity[];
}
