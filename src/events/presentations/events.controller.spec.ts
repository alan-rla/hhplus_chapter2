import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import dayjs from 'dayjs';
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
import { EventsService } from '../application/events.service';
import { EventsRepositoryImpl } from '../infrastructure/repositories/events.repository';
import { QueuesRepositoryImpl } from '../../queues/infrastructure/repositories/queues.repository';
import { UsersRepositoryImpl } from '../../users/infrastructure/repositories/users.repository';
import { ReservationStatusEnum, SeatStatusEnum } from '../../libs/types';

const eventId = 1;
const seatId = 1;
const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const reservationId = 1;
const eventDates = [
  {
    id: 1,
    eventId,
    eventDate: dayjs(Date.now()).toDate(),
    seatCount: 50,
    bookStartDate: dayjs(Date.now()).toDate(),
    bookEndDate: dayjs(Date.now()).toDate(),
    createdAt: dayjs(Date.now()).toDate(),
    updatedAt: dayjs(Date.now()).toDate(),
    deletedAt: null,
  },
];
const seats = [
  {
    id: 1,
    seatNumber: 1,
    status: SeatStatusEnum.AVAILABLE,
    eventPropertyId: 1,
    seatPropertyId: 1,
    seatProperty: {
      id: 1,
      name: '스탠딩',
      price: 100000,
    },
  },
];
const reservation = {
  id: 1,
  seatId,
  userId,
  status: ReservationStatusEnum.RESERVED,
  createdAt: dayjs(Date.now()).toDate(),
  updatedAt: dayjs(Date.now()).toDate(),
  deletedAt: null,
  eventId: 1,
  eventName: '공연 이름',
  eventPropertyId: 1,
  eventDate: dayjs(Date.now()).toDate(),
  price: 50000,
};
const paidResevation = {
  id: reservationId,
  seatId: 1,
  userId,
  status: ReservationStatusEnum.PAID,
  createdAt: dayjs(Date.now()).toDate(),
  updatedAt: dayjs(Date.now()).toDate(),
  deletedAt: null,
  eventId: 1,
  eventName: '공연 이름',
  eventPropertyId: 1,
  eventDate: dayjs(Date.now()).toDate(),
  price: 50000,
};

describe('EventsController', () => {
  let module: TestingModule;
  let controller: EventsController;
  let service: EventsService;

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
      controllers: [EventsController],
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

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /events/{:eventId}/dates', () => {
    // 공연 날짜 조회
    it('should return dates for an event', async () => {
      jest.useFakeTimers();
      jest.spyOn(service, 'getEventDates').mockResolvedValue(eventDates);
      await expect(controller.getEventDates({ eventId })).resolves.toEqual(eventDates);
    });
  });

  describe('GET /events/properties/{:eventPropertyId}/seats', () => {
    // 선택한 날짜 좌석 조회
    it('should return seats belonging to a date of an event', async () => {
      jest.spyOn(service, 'getSeats').mockResolvedValue(seats);
      await expect(controller.getSeats({ eventPropertyId: 1 })).resolves.toEqual(seats);
    });
  });

  describe('POST /events/seats/', () => {
    // 좌석 예약
    it('should post seat reservation and be returned with reservation', async () => {
      jest.useFakeTimers();
      jest.spyOn(service, 'reserveSeat').mockResolvedValue(reservation);
      await expect(controller.postSeatReservation({ seatId, userId })).resolves.toEqual(reservation);
    });
  });

  describe('PUT /events/reservations/:reservationId/users/:userId/pay', () => {
    // 좌석 결제
    it('should put seat reservation to paid and be returned with reservation', async () => {
      jest.useFakeTimers();
      jest.spyOn(service, 'paySeatReservation').mockResolvedValue(paidResevation);
      await expect(controller.putSeatReservation({ reservationId, userId })).resolves.toEqual(paidResevation);
    });
  });
});
