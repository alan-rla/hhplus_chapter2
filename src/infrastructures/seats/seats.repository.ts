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
    const entity = Mapper.classTransformer(SeatEntity, { eventPropertyId });
    const seats = await this.dataSource
      .getRepository(SeatEntity)
      .find({ where: entity, relations: { seatProperty: true } });
    return seats.map((entity) => Mapper.classTransformer(Seat, entity));
  }

  async getSeatById(id: number, lock?: boolean): Promise<Seat> {
    const entity = Mapper.classTransformer(SeatEntity, { id });
    const findCondition = { where: entity, relations: { seatProperty: true } };
    if (lock) Object.assign(findCondition, { lock: { mode: 'optimistic', version: 1 } });
    const seat = await this.dataSource.getRepository(SeatEntity).findOne(findCondition);
    return Mapper.classTransformer(Seat, seat);
  }

  async putSeatStatus(id: number, status: SeatStatusEnum): Promise<boolean> {
    const seat = await this.dataSource.getRepository(SeatEntity).update({ id }, { status });
    return seat.affected ? true : false;
  }
}
