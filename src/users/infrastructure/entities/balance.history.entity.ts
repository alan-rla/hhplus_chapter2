import { BalanceTypeEnum } from '../../../libs/types';
import { PaymentEntity } from './../../../events/infrastructure/entities';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsEnum, IsNumber, IsUUID, ValidateNested } from 'class-validator';

@Entity({ name: 'balanceHistory' })
export class BalanceHistoryEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsUUID()
  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @IsEnum(BalanceTypeEnum)
  @Column({
    type: 'enum',
    name: 'type',
    enum: BalanceTypeEnum,
  })
  type: BalanceTypeEnum;

  @IsNumber()
  @Column('int', { name: 'amount' })
  amount: number;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @ValidateNested()
  @OneToOne(() => PaymentEntity, (payment) => payment.balanceHistory)
  payment: PaymentEntity;
}
