import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'userBalance' })
export class UserBalanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Column('int', { name: 'balance' })
  balance: number;
}
