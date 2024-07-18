import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/database.module';
import { DatabaseService } from '../../database/database.service';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../database/database.config';
import { EventsRepositoryImpl } from '../infrastructure/repositories/events.repository';
import { QueuesRepositoryImpl } from '../../queues/infrastructure/repositories/queues.repository';
import { UsersRepositoryImpl } from '../../users/infrastructure/repositories/users.repository';
import { EventsRepository } from '../domain/repositories/events.repository';
import { QueuesRepository } from '../../queues/domain/repositories/queues.repository';
import { UsersRepository } from '../../users/domain/repositories/users.repository';
import { HttpException } from '@nestjs/common';
import { QueueStatusEnum, ReservationStatusEnum, SeatStatusEnum } from '../../libs/types';
import dayjs from 'dayjs';

const seatId = 1;
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
  userId: null,
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
const userBalance = {
  id: 1,
  userId,
  balance: null,
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
const queue = {
  id: 1,
  userId,
  eventId,
  status: QueueStatusEnum.ACTIVATED,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  deletedAt: null,
};
const balanceHistory = {
  id: 1,
  userId,
  type: null,
  amount: 50000,
  createdAt: expect.any(Date),
};
const payment = {
  id: 1,
  reservationId: 1,
  balanceHistoryId: 1,
};

describe('EventsService', () => {
  let module: TestingModule;
  let service: EventsService;
  let eventsRepository: EventsRepository;
  let queuesRepository: QueuesRepository;
  let usersRepository: UsersRepository;

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
        EventsService,
        {
          provide: 'EventsRepository',
          useClass: EventsRepositoryImpl,
        },
        {
          provide: 'QueuesRepository',
          useClass: QueuesRepositoryImpl,
        },
        {
          provide: 'UsersRepository',
          useClass: UsersRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<EventsRepository>('EventsRepository');
    queuesRepository = module.get<QueuesRepository>('QueuesRepository');
    usersRepository = module.get<UsersRepository>('UsersRepository');
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserve seat', () => {
    // 좌석 예약 성공
    it('should return post reservation and be returned with reservation', async () => {
      seat.status = SeatStatusEnum.AVAILABLE;
      reservation.userId = userId;
      reservation.status = ReservationStatusEnum.RESERVED;
      jest.spyOn(eventsRepository, 'getSeatById').mockResolvedValue(seat);
      jest.spyOn(eventsRepository, 'putSeatStatus').mockResolvedValue(true);
      jest.spyOn(eventsRepository, 'getEventPropertyById').mockResolvedValue(eventProperty);
      jest.spyOn(eventsRepository, 'reserveSeat').mockResolvedValue(reservation);
      await expect(service.reserveSeat({ seatId, userId })).resolves.toEqual(reservation);
    });
    // 좌석 없음 예외처리
    it('should throw error if seat does not exist', async () => {
      jest.spyOn(eventsRepository, 'getSeatById').mockResolvedValue(null);
      await expect(service.reserveSeat({ seatId, userId })).rejects.toThrow(new HttpException('SEAT_NOT_FOUND', 500));
    });
    // 좌석 상태 OCCUPIED 예외처리
    it('should throw error if seat is occupied', async () => {
      seat.status = SeatStatusEnum.OCCUPIED;
      jest.spyOn(eventsRepository, 'getSeatById').mockResolvedValue(seat);
      await expect(service.reserveSeat({ seatId, userId })).rejects.toThrow(new HttpException('SEAT_OCCUPIED', 500));
    });
  });

  describe('pay reservation', () => {
    // 대기열 생성 성공
    it('should return updated reservation after paying reservation', async () => {
      reservation.userId = userId;
      reservation.status = ReservationStatusEnum.RESERVED;
      userBalance.balance = 50000;
      jest.spyOn(eventsRepository, 'getReservationById').mockResolvedValue(reservation);
      jest.spyOn(usersRepository, 'getUserBalanceById').mockResolvedValue(userBalance);
      jest.spyOn(queuesRepository, 'getByUserIdAndEventId').mockResolvedValue(queue);
      jest.spyOn(queuesRepository, 'putQueueStatus').mockResolvedValue(true);
      jest.spyOn(usersRepository, 'putUserBalance').mockResolvedValue(true);
      jest.spyOn(usersRepository, 'use').mockResolvedValue(balanceHistory);
      jest.spyOn(eventsRepository, 'postPayment').mockResolvedValue(payment);
      jest.spyOn(eventsRepository, 'putReservation').mockResolvedValue(true);
      await expect(service.paySeatReservation({ reservationId, userId })).resolves.toEqual(reservation);
    });
    // 예약 없음 예외처리
    it('should throw error if reservation does not exist', async () => {
      jest.spyOn(eventsRepository, 'getReservationById').mockResolvedValue(null);
      await expect(service.paySeatReservation({ reservationId, userId })).rejects.toThrow(
        new HttpException('RESERVATION_NOT_FOUND', 500),
      );
    });
    // 예약한 사용자 다르면 예외처리
    it('should throw error if userId of reservation is inconsistent', async () => {
      reservation.userId = userId2;
      reservation.status = ReservationStatusEnum.RESERVED;
      jest.spyOn(eventsRepository, 'getReservationById').mockResolvedValue(reservation);
      await expect(service.paySeatReservation({ reservationId, userId })).rejects.toThrow(
        new HttpException('WRONG_USERID', 500),
      );
    });
    // 예약한 상태 RESERVED 아니면 예외처리
    it('should throw error if reservation status is not RESERVED', async () => {
      reservation.userId = userId;
      reservation.status = ReservationStatusEnum.PAID;
      jest.spyOn(eventsRepository, 'getReservationById').mockResolvedValue(reservation);
      await expect(service.paySeatReservation({ reservationId, userId })).rejects.toThrow(
        new HttpException('WRONG_RESERVATION_STATUS', 500),
      );
    });
    // 잔액 부족 예외처리
    it('should throw error if user balance is not enough', async () => {
      reservation.userId = userId;
      reservation.status = ReservationStatusEnum.RESERVED;
      userBalance.balance = 10000;
      jest.spyOn(eventsRepository, 'getReservationById').mockResolvedValue(reservation);
      jest.spyOn(usersRepository, 'getUserBalanceById').mockResolvedValue(userBalance);
      await expect(service.paySeatReservation({ reservationId, userId })).rejects.toThrow(
        new HttpException('BALANCE_NOT_ENOUGH', 500),
      );
    });
  });
});
