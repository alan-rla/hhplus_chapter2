import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { DatabaseModule } from '../src/database/database.module';
import { DatabaseService } from '../src/database/database.service';
import { EventsModule } from '../src/events/events.module';
import { QueuesModule } from '../src/presentations/queues/queues.module';
import { UsersModule } from '../src/users/users.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRootAsync({
          imports: [DatabaseModule],
          useClass: DatabaseService,
          inject: [DatabaseService],
        }),
        DatabaseModule,
        EventsModule,
        QueuesModule,
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        transform: true,
        // forbidNonWhitelisted: true,
        // validateCustomDecorators: true,
        exceptionFactory: (errors) => {
          const result = errors.map((error) => ({
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]],
          }));
          return new BadRequestException(result);
        },
      }),
    );
    await app.init();
    jest.useFakeTimers();
  });

  afterEach(async () => {
    jest.useRealTimers();
    await app.close();
  });

  describe('대기열 생성', () => {
    it('POST /queues', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      const eventId = 1;
      await request(app.getHttpServer())
        .post('/queues')
        .send({ userId, eventId })
        .expect(201)
        .expect({
          id: 1,
          userId,
          eventId,
          status: 'STANDBY',
          createdAt: dayjs(Date.now()).toISOString(),
        });
    });
  });

  describe('대기열 조회', () => {
    it('GET /queues/users/{:userId}/events/{:eventId}', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      const eventId = 1;
      await request(app.getHttpServer())
        .post(`/queues/uesrs/${userId}/events/${eventId}`)
        .expect(201)
        .expect({
          id: 1,
          userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
          eventId: 1,
          status: 'STANDBY',
          createdAt: dayjs(Date.now()).toISOString(),
        });
    });
  });

  describe('콘서트 날짜 조회', () => {
    it('GET /events/{:eventId}/dates', async () => {
      const eventId = 1;
      await request(app.getHttpServer())
        .get(`/events/${eventId}/dates`)
        .expect(200)
        .expect([
          {
            id: 1,
            eventId,
            eventDate: dayjs(Date.now()).toISOString(),
            seatCount: 50,
            bookStartDate: dayjs(Date.now()).toISOString(),
            bookEndDate: dayjs(Date.now()).toISOString(),
            createdAt: dayjs(Date.now()).toISOString(),
            updatedAt: dayjs(Date.now()).toISOString(),
            deletedAt: null,
          },
        ]);
    });
  });

  describe('콘서트 좌석 조회', () => {
    it('GET /events/properties/{:propertyId}/seats', async () => {
      const propertyId = 1;
      await request(app.getHttpServer())
        .get(`/events/properties/${propertyId}/seats`)
        .expect(200)
        .expect([
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
        ]);
    });
  });

  describe('콘서트 좌석 예약', () => {
    it('POST /events/seats/reservation', async () => {
      const seatId = 1;
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      await request(app.getHttpServer())
        .post(`/events/seats/reservation`)
        .send({ seatId, userId })
        .expect(201)
        .expect({
          id: 1,
          seatId: 1,
          userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
          status: 'RESERVED',
          eventId: 1,
          eventName: '공연 이름',
          eventPropertyId: 1,
          eventDate: dayjs(Date.now()).toISOString(),
          price: 50000,
        });
    });
  });

  describe('사용자 잔액 조회', () => {
    it('POST /users/{:userId}/balance', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      await request(app.getHttpServer()).get(`/users/${userId}/balance`).expect(200).expect({
        id: 1,
        userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
        balance: 50000,
      });
    });
  });

  describe('사용자 잔액 충전', () => {
    it('PUT /users/{:userId}/balance/charge', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      const amount = 50000;
      await request(app.getHttpServer()).put(`/users/${userId}/balance/charge`).send({ amount }).expect(200).expect({
        id: 1,
        userId,
        type: 'CHARGE',
        amount,
      });
    });
  });

  describe('예약한 좌석 결재', () => {
    it('PUT /events/reservations/{:reservationId}/pay', async () => {
      const reservationId = 1;
      await request(app.getHttpServer())
        .put(`/events/reservations/${reservationId}/pay`)
        .expect(200)
        .expect({
          id: reservationId,
          seatId: 1,
          userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
          status: 'PAID',
          eventId: 1,
          eventName: '공연 이름',
          eventPropertyId: 1,
          eventDate: dayjs(Date.now()).toISOString(),
          price: 50000,
        });
    });
  });
});
