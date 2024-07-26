import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReservationEntity } from '@src/infrastructures/entities';
import { ReservationStatusEnum } from '@src/libs/types';
import { Mapper } from '@src/libs/mappers';
import { ReservationsRepository } from '@src/domains/repositories';
import { Reservation } from '@src/domains/reservations/reservations.model';

@Injectable()
export class ReservationsRepositoryImpl implements ReservationsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async postReservation(args: Reservation): Promise<Reservation> {
    const entity = await Mapper.classTransformer(ReservationEntity, args);
    const reservation = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(ReservationEntity)
      .values(entity)
      .returning('*')
      .execute();
    return await Mapper.classTransformer(Reservation, reservation.raw[0]);
  }

  async getReservationById(id: number): Promise<Reservation> {
    const entity = await Mapper.classTransformer(ReservationEntity, { id });
    const reservation = await this.dataSource
      .getRepository(ReservationEntity)
      .findOne({ where: entity, lock: { mode: 'optimistic', version: 1 } });
    return await Mapper.classTransformer(Reservation, reservation);
  }

  async putReservation(id: number, status: ReservationStatusEnum): Promise<boolean> {
    const reservation = await this.dataSource.getRepository(ReservationEntity).update({ id }, { status });
    return reservation.affected ? true : false;
  }
}
