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
      jest.useFakeTimers();
      await expect(controller.createQueue({ userId })).resolves.toEqual({
        success: true,
        data: {
          id: 1,
          userId: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
          eventId: 1,
          status: 'STAND_BY',
          createdAt: dayjs(Date.now()).toDate(),
        },
      });
    });
  });
});
