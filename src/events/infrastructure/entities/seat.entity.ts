import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventPropertyEntity } from './event.property.entity';
import { SeatStatusEnum } from '../../../libs/types';
import { ReservationEntity } from './reservation.entity';
import { SeatPropertyEntity } from './seat.property.entity';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';

@Entity({ name: 'seat' })
export class SeatEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsNumber()
  @Column('int', { name: 'seatNumber' })
  seatNumber: number;

  @Expose()
  @IsEnum(SeatStatusEnum)
  @Column({
    type: 'enum',
    name: 'status',
    enum: SeatStatusEnum,
  })
  status: SeatStatusEnum;

  @Expose()
  @ValidateNested()
  @ManyToOne(() => EventPropertyEntity, (eventProperty) => eventProperty.seat)
  @JoinColumn([{ name: 'eventPropertyId', referencedColumnName: 'id' }])
  eventProperty: EventPropertyEntity;
  @Expose()
  @IsNumber()
  @Column('int', { name: 'eventPropertyId' })
  eventPropertyId: number;

  @Expose()
  @ValidateNested()
  @ManyToOne(() => SeatPropertyEntity, (seatProperty) => seatProperty.seat)
  @JoinColumn([{ name: 'seatPropertyId', referencedColumnName: 'id' }])
  seatProperty: SeatPropertyEntity;
  @Expose()
  @IsNumber()
  @Column('int', { name: 'seatPropertyId' })
  seatPropertyId: number;

  @Expose()
  @ValidateNested()
  @OneToMany(() => ReservationEntity, (reservation) => reservation.seat)
  reservation: ReservationEntity[];
}
