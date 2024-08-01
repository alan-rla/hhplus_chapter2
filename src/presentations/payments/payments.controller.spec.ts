import { Test, TestingModule } from '@nestjs/testing';
import dayjs from 'dayjs';
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
import { ReservationStatusEnum } from '@src/libs/types';
import { controllers } from '@src/presentations';
import { facades } from '@src/applications';
import { services } from '@src/domains';
import { repositories } from '@src/infrastructures';
import { guards } from '@src/libs/guards';
import { PaymentsController } from '@src/presentations/payments/payments.controller';
import { PaymentsFacade } from '@src/applications/payments/payments.facade';

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const reservationId = 1;
const paidReservation = {
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

describe('PaymentsController', () => {
  let module: TestingModule;
  let controller: PaymentsController;
  let facade: PaymentsFacade;

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
      controllers: [...controllers],
      providers: [...facades, ...services, ...repositories, ...guards],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    facade = module.get<PaymentsFacade>(PaymentsFacade);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('PUT /payments/reservations/:reservationId/users/:userId', () => {
    // 예약 결제
    it('should return reservation', async () => {
      jest.useFakeTimers();
      jest.spyOn(facade, 'payReservation').mockResolvedValue(paidReservation);
      await expect(controller.payReservation({ reservationId, userId })).resolves.toEqual(paidReservation);
    });
  });
});
