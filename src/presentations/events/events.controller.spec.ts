import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { facades } from '@src/applications';
import { EventsFacade } from '@src/applications/events/events.facade';
import { dataSourceOptions } from '@src/database/database.config';
import { DatabaseModule } from '@src/database/database.module';
import { DatabaseService } from '@src/database/database.service';
import { services } from '@src/domains';
import { repositories } from '@src/infrastructures';
import { guards } from '@src/libs/guards';
import { controllers } from '@src/presentations';
import dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { EventsController } from './events.controller';

const eventId = 1;
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

describe('EventsController', () => {
  let module: TestingModule;
  let controller: EventsController;
  let facade: EventsFacade;

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

    controller = module.get<EventsController>(EventsController);
    facade = module.get<EventsFacade>(EventsFacade);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /events/:eventId/properties', () => {
    // 공연 날짜 조회
    it('should return dates for an event', async () => {
      jest.useFakeTimers();
      jest.spyOn(facade, 'getEventProperties').mockResolvedValue(eventDates);
      await expect(controller.getEventProperties({ eventId })).resolves.toEqual(eventDates);
    });
  });
});
