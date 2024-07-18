import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SeatEntity } from './seat.entity';

import { IsNumber, IsString, ValidateNested } from 'class-validator';

@Entity({ name: 'seatProperty' })
export class SeatPropertyEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column('varchar', { name: 'name' })
  name: string;

  @IsNumber()
  @Column('int', { name: 'price' })
  price: number;

  @ValidateNested()
  @OneToMany(() => SeatEntity, (seat) => seat.seatProperty)
  seat: SeatEntity[];
}
