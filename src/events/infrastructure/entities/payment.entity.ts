import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { BalanceHistoryEntity } from '../../../users/infrastructure/entities';

@Entity({ name: 'payment' })
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ReservationEntity, (reservation) => reservation.payment)
  @JoinColumn([{ name: 'reservationId', referencedColumnName: 'id' }])
  reservation: ReservationEntity;
  @Column('int', { name: 'reservationId' })
  reservationId: number;

  @OneToOne(() => BalanceHistoryEntity, (balanceHistory) => balanceHistory.payment)
  @JoinColumn([{ name: 'balanceHistoryId', referencedColumnName: 'id' }])
  balanceHistory: BalanceHistoryEntity;
  @Column('int', { name: 'balanceHistoryId' })
  balanceHistoryId: number;
}
