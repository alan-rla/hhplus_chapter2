import { HttpException, Injectable } from '@nestjs/common';
import { SeatStatusEnum } from '@src/libs/types';
import { SeatsRepository } from '@src/domains/repositories';
import { Seat } from '@src/domains/seats/seats.model';

@Injectable()
export class SeatsService {
  constructor(private readonly seatsRepository: SeatsRepository) {}

  async getSeatsByEventPropertyId(eventPropertyId: number): Promise<Seat[]> {
    return await this.seatsRepository.getSeats(eventPropertyId);
  }

  async getSeatById(seatId: number): Promise<Seat> {
    // pessimistic_write 적용한 좌석 검색
    const seat = await this.seatsRepository.getSeatById(seatId);
    if (!seat) throw new HttpException('SEAT_NOT_FOUND', 500);
    return seat;
  }

  async putSeatStatusToOccupied(seat: Seat): Promise<Seat> {
    // 좌석 상태 검증
    if (seat.status === SeatStatusEnum.OCCUPIED) throw new HttpException('SEAT_OCCUPIED', 500);
    // 좌석 상태 AVAILABLE => OCCUPIED 변경
    await this.seatsRepository.putSeatStatus(seat.id, SeatStatusEnum.OCCUPIED);
    seat.status = SeatStatusEnum.OCCUPIED;
    return seat;
  }
}
