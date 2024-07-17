import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { BalanceHistoryEntity } from '../../../users/infrastructure/entities';
import { Expose } from 'class-transformer';
import { IsDate, IsNumber, ValidateNested } from 'class-validator';

@Entity({ name: 'payment' })
export class PaymentEntity {
  @Expose()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @ValidateNested()
  @ManyToOne(() => ReservationEntity, (reservation) => reservation.payment)
  @JoinColumn([{ name: 'reservationId', referencedColumnName: 'id' }])
  reservation: ReservationEntity;
  @Expose()
  @IsNumber()
  @Column('int', { name: 'reservationId' })
  reservationId: number;

  @Expose()
  @ValidateNested()
  @OneToOne(() => BalanceHistoryEntity, (balanceHistory) => balanceHistory.payment)
  @JoinColumn([{ name: 'balanceHistoryId', referencedColumnName: 'id' }])
  balanceHistory: BalanceHistoryEntity;
  @Expose()
  @IsNumber()
  @Column('int', { name: 'balanceHistoryId' })
  balanceHistoryId: number;
}
