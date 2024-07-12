import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SeatEntity } from './seat.entity';

@Entity({ name: 'seatProperty' })
export class SeatPropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'name' })
  name: string;

  @Column('int', { name: 'price' })
  price: number;

  @OneToMany(() => SeatEntity, (seat) => seat.seatProperty)
  seat: SeatEntity[];
}
