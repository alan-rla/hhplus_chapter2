import { Expose } from 'class-transformer';
import { BalanceTypeEnum } from '../../../libs/types';
import { PaymentEntity } from './../../../events/infrastructure/entities';
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsEnum, IsNumber, IsUUID, ValidateNested } from 'class-validator';

@Entity({ name: 'balanceHistory' })
export class BalanceHistoryEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsUUID()
  @Column('varchar', { name: 'userId', length: 36 })
  userId: string;

  @Expose()
  @IsEnum(BalanceTypeEnum)
  @Column({
    type: 'enum',
    name: 'type',
    enum: BalanceTypeEnum,
  })
  type: BalanceTypeEnum;

  @Expose()
  @IsNumber()
  @Column('int', { name: 'amount' })
  amount: number;

  @Expose()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @ValidateNested()
  @OneToOne(() => PaymentEntity, (payment) => payment.balanceHistory)
  payment: PaymentEntity;
}
