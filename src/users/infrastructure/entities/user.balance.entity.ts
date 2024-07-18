import { IsNumber, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'userBalance' })
export class UserBalanceEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsUUID()
  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @IsNumber()
  @Column('int', { name: 'balance' })
  balance: number;
}
