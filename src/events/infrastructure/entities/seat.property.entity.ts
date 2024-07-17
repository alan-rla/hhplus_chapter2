import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SeatEntity } from './seat.entity';
import { Expose } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

@Entity({ name: 'seatProperty' })
export class SeatPropertyEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsString()
  @Column('varchar', { name: 'name' })
  name: string;

  @Expose()
  @IsNumber()
  @Column('int', { name: 'price' })
  price: number;

  @Expose()
  @ValidateNested()
  @OneToMany(() => SeatEntity, (seat) => seat.seatProperty)
  seat: SeatEntity[];
}
