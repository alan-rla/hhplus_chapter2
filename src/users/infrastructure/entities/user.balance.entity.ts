import { Expose } from 'class-transformer';
import { IsNumber, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'userBalance' })
export class UserBalanceEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsUUID()
  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Expose()
  @IsNumber()
  @Column('int', { name: 'balance' })
  balance: number;
}
