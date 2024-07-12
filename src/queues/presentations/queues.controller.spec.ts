import { Test, TestingModule } from '@nestjs/testing';
import { QueuesController } from './queues.controller';
import dayjs from 'dayjs';
import { QueuesService } from '../application/queues.service';
import { QueueStatusEnum } from '../../libs/types';

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

const mockQueuesService = {
  post: jest.fn(),
  getByUserIdAndEventId: jest.fn(),
};

describe('QueuesController', () => {
  let module: TestingModule;
  let controller: QueuesController;
  let service: QueuesService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [QueuesController],
      providers: [QueuesService],
    })
      .overrideProvider(QueuesService)
      .useValue(mockQueuesService)
      .compile();

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
  });

  describe('GET /queues/users/{:userId}/events/{:eventId}', () => {
    // 대기열 생성
    it('should return a queue for userId + eventId', async () => {
      jest.useFakeTimers();
      jest.spyOn(service, 'getByUserIdAndEventId').mockResolvedValue(result);
      await expect(controller.getQueue({ userId, eventId })).resolves.toEqual(result);
    });
  });
});
