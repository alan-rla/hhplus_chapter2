import { BalanceTypeEnum } from '../../../libs/types';
import { PaymentEntity } from './../../../events/infrastructure/entities';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'balanceHistory' })
export class BalanceHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Column({
    type: 'enum',
    name: 'type',
    enum: BalanceTypeEnum,
  })
  type: BalanceTypeEnum;

  @Column('int', { name: 'amount' })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => PaymentEntity, (payment) => payment.balanceHistory)
  payment: PaymentEntity;
}
