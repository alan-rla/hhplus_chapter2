import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let module: TestingModule;
  let controller: UsersController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users/{:userId}/balance', () => {
    // 공연 날짜 조회
    it('should return balance of a user', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      await expect(controller.getUserBalance({ userId })).resolves.toEqual({
        success: true,
        data: {
          id: 1,
          userId,
          balance: 50000,
        },
      });
    });
  });

  describe('PUT /users/{:userId}/balance/charge', () => {
    // 공연 날짜 조회
    it('should charge balance of a user and return charge history', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      const amount = 50000;
      await expect(controller.chargeUserBalance({ userId }, { amount })).resolves.toEqual({
        success: true,
        data: {
          id: 1,
          userId,
          type: 'CHARGE',
          amount,
        },
      });
    });
  });
});
