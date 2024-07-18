import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventPropertyEntity } from './event.property.entity';
import { SeatStatusEnum } from '../../../libs/types';
import { ReservationEntity } from './reservation.entity';
import { SeatPropertyEntity } from './seat.property.entity';

import { IsEnum, IsNumber, ValidateNested } from 'class-validator';

@Entity({ name: 'seat' })
export class SeatEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column('int', { name: 'seatNumber' })
  seatNumber: number;

  @IsEnum(SeatStatusEnum)
  @Column({
    type: 'enum',
    name: 'status',
    enum: SeatStatusEnum,
  })
  status: SeatStatusEnum;

  @ValidateNested()
  @ManyToOne(() => EventPropertyEntity, (eventProperty) => eventProperty.seat)
  @JoinColumn([{ name: 'eventPropertyId', referencedColumnName: 'id' }])
  eventProperty: EventPropertyEntity;

  @IsNumber()
  @Column('int', { name: 'eventPropertyId' })
  eventPropertyId: number;

  @ValidateNested()
  @ManyToOne(() => SeatPropertyEntity, (seatProperty) => seatProperty.seat)
  @JoinColumn([{ name: 'seatPropertyId', referencedColumnName: 'id' }])
  seatProperty: SeatPropertyEntity;

  @IsNumber()
  @Column('int', { name: 'seatPropertyId' })
  seatPropertyId: number;

  @ValidateNested()
  @OneToMany(() => ReservationEntity, (reservation) => reservation.seat)
  reservation: ReservationEntity[];
}
