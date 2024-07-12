import { Test, TestingModule } from '@nestjs/testing';
import { QueuesService } from './queues.service';
import { QueuesRepository } from '../domain/repositories/queues.repository';
import { QueueStatusEnum } from '../../libs/types';
import dayjs from 'dayjs';

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

const mockQueuesRepository = {
  post: jest.fn(),
  getByUserIdAndEventId: jest.fn(),
};

describe('QueuesService', () => {
  let module: TestingModule;
  let service: QueuesService;
  let repository: QueuesRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        QueuesService,
        {
          provide: QueuesRepository,
          useValue: mockQueuesRepository,
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

  describe('post queue', () => {
    // 대기열 생성
    it('should return a queue when userId is sent', async () => {
      jest.useFakeTimers();
      jest.spyOn(repository, 'post').mockResolvedValue(result);
      await expect(service.post(userId, eventId)).resolves.toEqual(result);
    });
  });

  describe('get queue by userId + eventId', () => {
    // 대기열 생성
    it('should return a queue for userId + eventId', async () => {
      jest.useFakeTimers();
      jest.spyOn(repository, 'getByUserIdAndEventId').mockResolvedValue(result);
      await expect(repository.getByUserIdAndEventId(userId, eventId)).resolves.toEqual(result);
    });
  });
});
