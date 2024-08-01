import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@src/database/database.module';
import { DatabaseService } from '@src/database/database.service';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '@src/database/database.config';
import { HttpException } from '@nestjs/common';
import { ReservationStatusEnum, SeatStatusEnum } from '@src/libs/types';
import dayjs from 'dayjs';
import { ReservationsRepository } from '@src/domains/repositories';
import { ReservationsRepositoryImpl } from '@src/infrastructures/reservations/reservations.repository';
import { ReservationsService } from '@src/domains/reservations/reservations.service';

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const userId2 = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435289';
const eventId = 1;
const reservationId = 1;
const seat = {
  id: 1,
  seatNumber: 1,
  status: null,
  eventPropertyId: 1,
  seatPropertyId: 1,
  seatProperty: {
    id: 1,
    name: '스탠딩',
    price: 100000,
  },
};
const reservation = {
  id: 1,
  seatId: 1,
  userId,
  status: null,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  deletedAt: null,
  eventId: 1,
  eventName: '공연이름',
  eventPropertyId: 1,
  eventDate: expect.any(Date),
  price: 50000,
};
const paidReservation = {
  id: 1,
  seatId: 1,
  userId,
  status: ReservationStatusEnum.PAID,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  deletedAt: null,
  eventId: 1,
  eventName: '공연이름',
  eventPropertyId: 1,
  eventDate: expect.any(Date),
  price: 50000,
};
const eventProperty = {
  id: 1,
  eventId,
  eventDate: dayjs(Date.now()).toDate(),
  seatCount: 50,
  bookStartDate: dayjs(Date.now()).toDate(),
  bookEndDate: dayjs(Date.now()).toDate(),
  createdAt: dayjs(Date.now()).toDate(),
  updatedAt: dayjs(Date.now()).toDate(),
  deletedAt: null,
  event: {
    id: 1,
    name: '공연 이름',
    starId: 1,
    createdAt: dayjs(Date.now()).toDate(),
    updatedAt: dayjs(Date.now()).toDate(),
    deletedAt: null,
  },
};

describe('ReservationsService', () => {
  let module: TestingModule;
  let service: ReservationsService;
  let repository: ReservationsRepository;

  beforeEach(async () => {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [DatabaseModule],
          useClass: DatabaseService,
          inject: [DatabaseService],
          dataSourceFactory: async () => {
            return getDataSourceByName('default') || addTransactionalDataSource(new DataSource(dataSourceOptions));
          },
        }),
      ],
      providers: [
        ReservationsService,
        {
          provide: ReservationsRepository,
          useClass: ReservationsRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    repository = module.get<ReservationsRepository>(ReservationsRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post reservation', () => {
    // 좌석 예약 성공
    it('should post reservation and be returned with reservation', async () => {
      jest.spyOn(repository, 'postReservation').mockResolvedValue(reservation);
      await expect(service.postReservation(seat, eventProperty, userId)).resolves.toEqual(reservation);
    });
    // 좌석 상태 OCCUPIED 예외처리
    it('should throw error if seat is occupied', async () => {
      seat.status = SeatStatusEnum.OCCUPIED;
      await expect(service.postReservation(seat, eventProperty, userId)).rejects.toThrow(
        new HttpException('SEAT_OCCUPIED', 500),
      );
    });
  });

  describe('get reservation by id', () => {
    // 예약 조회 성공
    it('should be returned with reservation', async () => {
      reservation.status = ReservationStatusEnum.RESERVED;
      jest.spyOn(repository, 'getReservationById').mockResolvedValue(reservation);
      await expect(service.getReservationById(reservationId)).resolves.toEqual(reservation);
    });
    // 예약 조회 실패
    it('should be returned with reservation', async () => {
      jest.spyOn(repository, 'getReservationById').mockResolvedValue(null);
      await expect(service.getReservationById(reservationId)).rejects.toThrow(
        new HttpException('RESERVATION_NOT_FOUND', 500),
      );
    });
  });

  describe('put reservation status to paid', () => {
    // 예약 상태 변경 성공
    it('should return updated reservation (status -> PAID', async () => {
      reservation.status = ReservationStatusEnum.RESERVED;
      reservation.userId = userId;
      jest.spyOn(repository, 'putReservation').mockResolvedValue(true);
      await expect(service.putReservationToPaid(reservation, userId)).resolves.toEqual(paidReservation);
    });
    // 예약의 userId 와 input userId 불일치
    it('should throw error if reservation does not exist', async () => {
      reservation.userId = userId2;
      await expect(service.putReservationToPaid(reservation, userId)).rejects.toThrow(
        new HttpException('WRONG_USERID', 500),
      );
    });
    // 예약 status !== RESERVED
    it('should throw error if reservation does not exist', async () => {
      reservation.userId = userId;
      reservation.status = ReservationStatusEnum.PAID;
      await expect(service.putReservationToPaid(reservation, userId)).rejects.toThrow(
        new HttpException('WRONG_RESERVATION_STATUS', 500),
      );
    });
  });
});
