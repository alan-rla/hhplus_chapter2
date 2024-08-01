import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SeatStatusEnum } from '@src/libs/types';
import { IsEnum, IsNumber, ValidateNested } from 'class-validator';
import { EventPropertyEntity } from '@src/infrastructures/entities/event.property.entity';
import { SeatPropertyEntity } from '@src/infrastructures/entities/seat.property.entity';
import { ReservationEntity } from '@src/infrastructures/entities/reservation.entity';

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
