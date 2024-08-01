import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsNumber, ValidateNested } from 'class-validator';
import { BalanceHistoryEntity } from '@src/infrastructures/entities/balance.history.entity';
import { ReservationEntity } from '@src/infrastructures/entities/reservation.entity';

@Entity({ name: 'payment' })
export class PaymentEntity {
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @ValidateNested()
  @ManyToOne(() => ReservationEntity, (reservation) => reservation.payment)
  @JoinColumn([{ name: 'reservationId', referencedColumnName: 'id' }])
  reservation: ReservationEntity;

  @IsNumber()
  @Column('int', { name: 'reservationId' })
  reservationId: number;

  @ValidateNested()
  @OneToOne(() => BalanceHistoryEntity, (balanceHistory) => balanceHistory.payment)
  @JoinColumn([{ name: 'balanceHistoryId', referencedColumnName: 'id' }])
  balanceHistory: BalanceHistoryEntity;

  @IsNumber()
  @Column('int', { name: 'balanceHistoryId' })
  balanceHistoryId: number;
}
