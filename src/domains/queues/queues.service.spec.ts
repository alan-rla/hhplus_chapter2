import { Test, TestingModule } from '@nestjs/testing';
import { QueuesRepository } from '@src/domains/repositories/queues.repository';
import { QueueStatusEnum } from '@src/libs/types';
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
import { HttpException } from '@nestjs/common';
import { QueuesService } from '@src/domains/queues/queues.service';
import { QueuesRepositoryImpl } from '@src/infrastructures/queues/queues.repository';

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const eventId = 1;
const queue = {
  id: 1,
  userId,
  eventId,
  status: null,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  deletedAt: null,
};
const expiredQueue = {
  id: 1,
  userId,
  eventId,
  status: QueueStatusEnum.EXPIRED,
  createdAt: expect.any(Date),
  updatedAt: expect.any(Date),
  deletedAt: null,
};

describe('QueuesService', () => {
  let module: TestingModule;
  let service: QueuesService;
  let repository: QueuesRepository;

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
          provide: QueuesRepository,
          useClass: QueuesRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<QueuesService>(QueuesService);
    repository = module.get<QueuesRepository>(QueuesRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get queue by userId + eventId', () => {
    // 대기열 조회
    it('should return a queue for userId + eventId', async () => {
      queue.status = QueueStatusEnum.STANDBY;
      jest.spyOn(repository, 'getLatestQueueByUserIdAndEventId').mockResolvedValue(queue);
      await expect(service.getLatestQueueByUserIdAndEventId(userId, eventId)).resolves.toEqual(queue);
    });
  });

  describe('post queue', () => {
    // 대기열 생성 성공 1
    it('should return a queue if queue does not already exist', async () => {
      queue.status = QueueStatusEnum.STANDBY;
      jest.spyOn(repository, 'post').mockResolvedValue(queue);
      await expect(service.post(userId, eventId, null)).resolves.toEqual(queue);
    });
    // 대기열 생성 성공 2
    it('should return a queue if latest queue is expired', async () => {
      queue.status = QueueStatusEnum.STANDBY;
      jest.spyOn(repository, 'post').mockResolvedValue(queue);
      await expect(service.post(userId, eventId, expiredQueue)).resolves.toEqual(queue);
    });
    // 대기열 생성 실패 (STANDBY 대기열 존재)
    it('should throw error if queue status is STANDBY', async () => {
      queue.status = QueueStatusEnum.STANDBY;
      await expect(service.post(userId, eventId, queue)).rejects.toThrow(new HttpException('DUPLICATE_QUEUE', 500));
    });
    // 대기열 생성 실패 (ACTIVATED) 대기열 존재)
    it('should throw error if queue status is ACTIVATED', async () => {
      queue.status = QueueStatusEnum.ACTIVATED;
      await expect(service.post(userId, eventId, queue)).rejects.toThrow(new HttpException('DUPLICATE_QUEUE', 500));
    });
  });

  describe('expire queue', () => {
    // 대기열 만료 성공 1
    it('should return true if queue status is ACTIVATED', async () => {
      queue.status = QueueStatusEnum.ACTIVATED;
      jest.spyOn(repository, 'putQueueStatus').mockResolvedValue(true);
      await expect(service.expireQueue(queue)).resolves.toEqual(true);
    });
    // 대기열 만료 성공 2
    it('should return a true if queue status is STANDBY', async () => {
      queue.status = QueueStatusEnum.STANDBY;
      jest.spyOn(repository, 'putQueueStatus').mockResolvedValue(true);
      await expect(service.expireQueue(queue)).resolves.toEqual(true);
    });
    // 대기열 만료 실패 (대기열 존재하지 않는 대기열)
    it('should throw error if queue does not exist', async () => {
      await expect(service.expireQueue(null)).rejects.toThrow(new HttpException('QUEUE_NOT_FOUND', 500));
    });
    // 대기열 만료 실패 (이미 만료된 대기열 시도)
    it('should throw error if queue status is already EXPIRED', async () => {
      await expect(service.expireQueue(expiredQueue)).rejects.toThrow(new HttpException('QUEUE_NOT_FOUND', 500));
    });
  });
});
