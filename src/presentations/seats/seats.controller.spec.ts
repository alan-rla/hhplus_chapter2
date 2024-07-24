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
import { SeatStatusEnum } from '@src/libs/types';
import { controllers } from '@src/presentations';
import { facades } from '@src/applications';
import { services } from '@src/domains';
import { repositories } from '@src/infrastructures';
import { guards } from '@src/libs/guards';
import { SeatsController } from '@src/presentations/seats/seats.controller';
import { SeatsFacade } from '@src/applications/seats/seats.facade';

const eventPropertyId = 1;
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

describe('SeatsController', () => {
  let module: TestingModule;
  let controller: SeatsController;
  let facade: SeatsFacade;

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

    controller = module.get<SeatsController>(SeatsController);
    facade = module.get<SeatsFacade>(SeatsFacade);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /seats/eventProperties/:eventPropertyId', () => {
    // 선택한 날짜 좌석 조회
    it('should return seats belonging to a property of an event', async () => {
      jest.spyOn(facade, 'getSeatsByEventPropertyId').mockResolvedValue(seats);
      await expect(controller.getSeats({ eventPropertyId })).resolves.toEqual(seats);
    });
  });
});
