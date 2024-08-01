import { Test, TestingModule } from '@nestjs/testing';
import { QueuesController } from './queues.controller';
import dayjs from 'dayjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { controllers } from '@src/presentations';
import { facades } from '@src/applications';
import { services } from '@src/domains';
import { repositories } from '@src/infrastructures';
import { guards } from '@src/libs/guards';
import { dataSourceOptions } from '@src/database/database.config';
import { QueueStatusEnum } from '@src/libs/types';
import { QueuesFacade } from '@src/applications/queues/queues.facade';
import { DatabaseModule } from '@src/database/database.module';
import { DatabaseService } from '@src/database/database.service';

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const eventId = 1;
const queue = {
  id: 1,
  userId,
  eventId,
  status: QueueStatusEnum.STANDBY,
  createdAt: dayjs(Date.now()).toDate(),
  updatedAt: dayjs(Date.now()).toDate(),
  deletedAt: null,
};

describe('QueuesController', () => {
  let module: TestingModule;
  let controller: QueuesController;
  let facade: QueuesFacade;

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

    controller = module.get<QueuesController>(QueuesController);
    facade = module.get<QueuesFacade>(QueuesFacade);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /queues', () => {
    // 대기열 생성
    it('should return a queue when userId/eventId are posted', async () => {
      jest.useFakeTimers();
      jest.spyOn(facade, 'post').mockResolvedValue(queue);
      await expect(controller.createQueue({ userId, eventId })).resolves.toEqual(queue);
    });
  });

  describe('GET /queues/users/{:userId}/events/{:eventId}', () => {
    // 대기열 조회
    it('should return a queue for userId + eventId', async () => {
      jest.useFakeTimers();
      jest.spyOn(facade, 'getQueueByUserIdAndEventId').mockResolvedValue(queue);
      await expect(controller.getQueue({ userId, eventId })).resolves.toEqual(queue);
    });
  });
});
