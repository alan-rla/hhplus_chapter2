import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import dayjs from 'dayjs';

describe('EventsController', () => {
  let module: TestingModule;
  let controller: EventsController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [EventsController],
    }).compile();

    controller = module.get<EventsController>(EventsController);
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
      const eventId = 1;
      jest.useFakeTimers();
      await expect(controller.getEventDates({ eventId })).resolves.toEqual({
        success: true,
        data: [
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
        ],
      });
    });
  });

  describe('GET /events/properties/{:propertyId}/seats', () => {
    // 선택한 날짜 좌석 조회
    it('should return seats belonging to a date of an event', async () => {
      const propertyId = 1;
      await expect(controller.getEventDateSeats({ propertyId })).resolves.toEqual({
        success: true,
        data: [
          {
            id: 1,
            seatNumber: 1,
            status: 'AVAILABLE',
            propertyId,
            seatProperty: {
              id: 1,
              name: '스탠딩',
              price: 100000,
            },
          },
        ],
      });
    });
  });

  describe('POST /events/seats/', () => {
    // 좌석 예약
    it('should post seat reservation and be returned with reservation', async () => {
      const seatId = 1;
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      jest.useFakeTimers();
      await expect(controller.postSeatReservation({ seatId, userId })).resolves.toEqual({
        success: true,
        data: {
          id: 1,
          seatId,
          userId,
          status: 'RESERVED',
          eventId: 1,
          eventName: '공연 이름',
          eventPropertyId: 1,
          eventDate: dayjs(Date.now()).toDate(),
          price: 50000,
        },
      });
    });
  });

  describe('PUT /events/reservations/{:reservationId}/pay', () => {
    // 좌석 예약
    it('should put seat reservation to paid and be returned with reservation', async () => {
      const reservationId = 1;
      jest.useFakeTimers();
      await expect(controller.paySeatReservation({ reservationId })).resolves.toEqual({
        success: true,
        data: {
          id: reservationId,
          seatId: 1,
          userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
          status: 'PAID',
          eventId: 1,
          eventName: '공연 이름',
          eventPropertyId: 1,
          eventDate: dayjs(Date.now()).toDate(),
          price: 50000,
        },
      });
    });
  });
});
