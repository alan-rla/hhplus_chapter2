import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';
import dayjs from 'dayjs';

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const result = {
  id: 1,
  userId,
  balance: 50000,
};
const amount = 50000;
const result2 = {
  id: 1,
  userId,
  type: 'CHARGE',
  amount,
  createdAt: dayjs(Date.now()).toDate(),
};

describe('UsersController', () => {
  let module: TestingModule;
  let controller: UsersController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUserBalanceById: jest.fn().mockResolvedValue(result),
            charge: jest.fn().mockResolvedValue(result2),
          },
        },
      ],
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
    // 사용자 잔액 조회
    it('should return balance of a user', async () => {
      await expect(controller.getUserBalance({ userId })).resolves.toEqual(result);
    });
  });

  describe('PUT /users/{:userId}/balance/charge', () => {
    // 사용자 잔액 충전 + 충전 기록 반환
    it('should charge balance of a user and return charge history', async () => {
      jest.useFakeTimers();
      await expect(controller.chargeUserBalance({ userId }, { amount })).resolves.toEqual(result2);
    });
  });
});
