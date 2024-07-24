import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaymentEntity } from '@src/infrastructures/entities';
import { Mapper } from '@src/libs/mappers';
import { PaymentsRepository } from '@src/domains/repositories';
import { Payment } from '@src/domains/payments/payments.model';

@Injectable()
export class PaymentsRepositoryImpl implements PaymentsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async postPayment(reservationId: number, balanceHistoryId: number): Promise<Payment> {
    const entity = await Mapper.classTransformer(PaymentEntity, { reservationId, balanceHistoryId });
    const payment = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(PaymentEntity)
      .values(entity)
      .returning('*')
      .execute();
    return await Mapper.classTransformer(Payment, payment.raw[0]);
  }
}
