import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SeatEntity } from '@src/infrastructures/entities';
import { SeatStatusEnum } from '@src/libs/types';
import { Mapper } from '@src/libs/mappers';
import { SeatsRepository } from '@src/domains/repositories';
import { Seat } from '@src/domains/seats/seats.model';

@Injectable()
export class SeatsRepositoryImpl implements SeatsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getSeats(eventPropertyId: number): Promise<Seat[]> {
    const entity = await Mapper.classTransformer(SeatEntity, { eventPropertyId });
    const seats = await this.dataSource
      .getRepository(SeatEntity)
      .find({ where: entity, relations: { seatProperty: true } });
    return await Promise.all(seats.map(async (entity) => await Mapper.classTransformer(Seat, entity)));
  }

  async getSeatById(id: number): Promise<Seat> {
    const entity = await Mapper.classTransformer(SeatEntity, { id });
    const seat = await this.dataSource
      .getRepository(SeatEntity)
      .findOne({ where: entity, lock: { mode: 'pessimistic_write' } });
    return await Mapper.classTransformer(Seat, seat);
  }

  async putSeatStatus(id: number, status: SeatStatusEnum): Promise<boolean> {
    const seat = await this.dataSource.getRepository(SeatEntity).update({ id }, { status });
    return seat.affected ? true : false;
  }
}
