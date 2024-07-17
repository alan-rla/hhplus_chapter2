import { Test, TestingModule } from '@nestjs/testing';
import { QueuesController } from './queues.controller';
import dayjs from 'dayjs';
import { QueuesService } from '../application/queues.service';
import { QueueStatusEnum } from '../../libs/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/database.module';
import { DatabaseService } from '../../database/database.service';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { dataSourceOptions } from '../../database/database.config';
import { DataSource } from 'typeorm';
import { QueuesRepositoryImpl } from '../infrastructure/repositories/queues.repository';
import { EventsRepositoryImpl } from '../../events/infrastructure/repositories/events.repository';
import { HttpException } from '@nestjs/common';

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const eventId = 1;
const result = {
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
  let service: QueuesService;

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
      controllers: [QueuesController],
      providers: [
        QueuesService,
        {
          provide: 'QueuesRepository',
          useClass: QueuesRepositoryImpl,
        },
        {
          provide: 'EventsRepository',
          useClass: EventsRepositoryImpl,
        },
      ],
    }).compile();

    controller = module.get<QueuesController>(QueuesController);
    service = module.get<QueuesService>(QueuesService);
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
      jest.spyOn(service, 'post').mockResolvedValue(result);
      await expect(controller.createQueue({ userId, eventId })).resolves.toEqual(result);
    });
    // 대기열 생성 실패 (공연 없음)
    it('should throw error if event does not exist', async () => {
      jest.spyOn(service, 'post').mockRejectedValue(new HttpException('EVENT_NOT_FOUND', 500));
      await expect(controller.createQueue({ userId, eventId })).rejects.toThrow(
        new HttpException('EVENT_NOT_FOUND', 500),
      );
    });
    // 대기열 생성 실패 (대기열 이미 존재)
    it('should throw error if queue already exists', async () => {
      jest.spyOn(service, 'post').mockRejectedValue(new HttpException('DUPLICATE_QUEUE', 500));
      await expect(controller.createQueue({ userId, eventId })).rejects.toThrow(
        new HttpException('DUPLICATE_QUEUE', 500),
      );
    });
  });

  describe('GET /queues/users/{:userId}/events/{:eventId}', () => {
    // 대기열 조회
    it('should return a queue for userId + eventId', async () => {
      jest.useFakeTimers();
      jest.spyOn(service, 'getByUserIdAndEventId').mockResolvedValue(result);
      await expect(controller.getQueue({ userId, eventId })).resolves.toEqual(result);
    });
  });
});
