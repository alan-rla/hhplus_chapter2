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
import { ReservationsFacade } from '@src/applications/reservations/reservations.facade';
import { ReservationssController } from '@src/presentations/reservations/reservations.controller';

const seatId = 1;
const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
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

describe('ReservatoinsController', () => {
  let module: TestingModule;
  let controller: ReservationssController;
  let facade: ReservationsFacade;

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

    controller = module.get<ReservationssController>(ReservationssController);
    facade = module.get<ReservationsFacade>(ReservationsFacade);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /reservations/seats', () => {
    // 공연 날짜 조회
    it('should return dates for an event', async () => {
      jest.useFakeTimers();
      jest.spyOn(facade, 'postReservation').mockResolvedValue(reservation);
      await expect(controller.postSeatReservation({ seatId, userId })).resolves.toEqual(reservation);
    });
  });
});
