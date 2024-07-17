import { Test, TestingModule } from '@nestjs/testing';
import { QueuesService } from './queues.service';
import { QueuesRepository } from '../domain/repositories/queues.repository';
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
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../database/database.config';
import { QueuesRepositoryImpl } from '../infrastructure/repositories/queues.repository';
import { EventsRepositoryImpl } from '../../events/infrastructure/repositories/events.repository';
import { EventsRepository } from '../../events/domain/repositories/events.repository';
import { HttpException } from '@nestjs/common';

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const eventId = 1;
const standbyQueue = {
  id: 1,
  userId,
  eventId,
  status: QueueStatusEnum.STANDBY,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  deletedAt: null,
};

const event = {
  id: 1,
  name: '공연 이름',
  starId: 1,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  deletedAt: null,
};

describe('QueuesService', () => {
  let module: TestingModule;
  let service: QueuesService;
  let queuesRepository: QueuesRepository;
  let eventsRepository: EventsRepository;

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

    service = module.get<QueuesService>(QueuesService);
    queuesRepository = module.get<QueuesRepository>('QueuesRepository');
    eventsRepository = module.get<EventsRepository>('EventsRepository');
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('post queue', () => {
    // 대기열 생성 성공
    it('should return a queue when userId is sent', async () => {
      jest.spyOn(eventsRepository, 'getEventById').mockResolvedValue(event);
      jest.spyOn(queuesRepository, 'getByUserIdAndEventId').mockResolvedValue(null);
      jest.spyOn(queuesRepository, 'post').mockResolvedValue(standbyQueue);
      await expect(service.post({ userId, eventId })).resolves.toEqual(standbyQueue);
    });
    // 대기열 생성 실패 (공연 없음)
    it('should throw error if event does not exist', async () => {
      jest.spyOn(eventsRepository, 'getEventById').mockResolvedValue(null);
      await expect(service.post({ userId, eventId })).rejects.toThrow(new HttpException('EVENT_NOT_FOUND', 500));
    });
    // 대기열 생성 실패 (대기열 이미 존재)
    it('should throw error if queue already exists', async () => {
      jest.spyOn(eventsRepository, 'getEventById').mockResolvedValue(event);
      jest.spyOn(queuesRepository, 'getByUserIdAndEventId').mockResolvedValue(standbyQueue);
      await expect(service.post({ userId, eventId })).rejects.toThrow(new HttpException('DUPLICATE_QUEUE', 500));
    });
  });

  describe('get queue by userId + eventId', () => {
    // 대기열 조회
    it('should return a queue for userId + eventId', async () => {
      jest.spyOn(queuesRepository, 'getByUserIdAndEventId').mockResolvedValue(standbyQueue);
      await expect(service.getByUserIdAndEventId({ userId, eventId })).resolves.toEqual(standbyQueue);
    });
  });
});
