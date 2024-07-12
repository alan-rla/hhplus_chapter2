import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventPropertyEntity } from './event.property.entity';
import { SeatStatusEnum } from '../../../libs/types';
import { ReservationEntity } from './reservation.entity';
import { SeatPropertyEntity } from './seat.property.entity';

@Entity({ name: 'seat' })
export class SeatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'seatNumber' })
  seatNumber: number;

  @Column({
    type: 'enum',
    name: 'type',
    enum: SeatStatusEnum,
  })
  type: SeatStatusEnum;

  @ManyToOne(() => EventPropertyEntity, (eventProperty) => eventProperty.seat)
  @JoinColumn([{ name: 'eventPropertyId', referencedColumnName: 'id' }])
  eventProperty: EventPropertyEntity;
  @Column('int', { name: 'eventPropertyId' })
  eventPropertyId: number;

  @ManyToOne(() => SeatPropertyEntity, (seatProperty) => seatProperty.seat)
  @JoinColumn([{ name: 'seatPropertyId', referencedColumnName: 'id' }])
  seatProperty: SeatPropertyEntity;
  @Column('int', { name: 'seatPropertyId' })
  seatPropertyId: number;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.seat)
  reservation: ReservationEntity[];
}
