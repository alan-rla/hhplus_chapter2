import { Test, TestingModule } from '@nestjs/testing';
import { QueuesController } from './queues.controller';
import dayjs from 'dayjs';

describe('QueuesController', () => {
  let module: TestingModule;
  let controller: QueuesController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [QueuesController],
    }).compile();

    controller = module.get<QueuesController>(QueuesController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /queues', () => {
    // 대기열 생성
    it('should return a queue when userId is sent', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      const eventId = 1;
      jest.useFakeTimers();
      await expect(controller.createQueue({ userId, eventId })).resolves.toEqual({
        id: 1,
        userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
        eventId,
        status: 'STANDBY',
        createdAt: dayjs(Date.now()).toDate(),
      });
    });
  });

  describe('GET /queues/users/{:userId}/events/{:eventId}', () => {
    // 대기열 생성
    it('should return a queue for userId + eventId', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      const eventId = 1;
      jest.useFakeTimers();
      await expect(controller.getQueue({ userId, eventId })).resolves.toEqual({
        id: 1,
        userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
        eventId,
        status: 'STANDBY',
        createdAt: dayjs(Date.now()).toDate(),
      });
    });
  });
});
