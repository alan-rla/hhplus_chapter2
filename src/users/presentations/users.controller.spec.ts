import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';

describe('UsersController', () => {
  let module: TestingModule;
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
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
      const result = {
        id: 1,
        userId,
        balance: 50000,
      };
      jest.spyOn(service, 'getUserBalance').mockResolvedValue(result);
      await expect(controller.getUserBalance({ userId })).resolves.toEqual(result);
    });
  });

  describe('PUT /users/{:userId}/balance/charge', () => {
    // 공연 날짜 조회
    it('should charge balance of a user and return charge history', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      const amount = 50000;
      await expect(controller.chargeUserBalance({ userId }, { amount })).resolves.toEqual({
        id: 1,
        userId,
        type: 'CHARGE',
        amount,
      });
    });
  });
});
