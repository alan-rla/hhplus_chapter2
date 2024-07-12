import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../domain/repositories/users.repository';
import dayjs from 'dayjs';
import { BalanceTypeEnum } from '../../libs/types';
import { DataSource, EntityManager } from 'typeorm';

const mockUsersRepository = {
  getUserBalanceById: jest.fn(),
  putUserBalance: jest.fn(),
  charge: jest.fn(),
  use: jest.fn(),
  refund: jest.fn(),
};

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const userBalance = {
  id: 1,
  userId,
  balance: 50000,
};
const amount = 50000;
const charge = BalanceTypeEnum.CHARGE;
const use = BalanceTypeEnum.USE;
const refund = BalanceTypeEnum.REFUND;
const balanceHistory = {
  id: 1,
  userId,
  type: null,
  amount,
  createdAt: dayjs(Date.now()).toDate(),
};

const entityManagerMock: Partial<EntityManager> = {
  transaction: jest.fn().mockImplementation(async (cb) =>
    cb({
      findOne: jest.fn(),
      save: jest.fn(),
    }),
  ),
};

const dataSourceMock: Partial<DataSource> = {
  manager: entityManagerMock as EntityManager,
  createEntityManager: jest.fn().mockReturnValue(entityManagerMock),
};

describe('UsersService', () => {
  let module: TestingModule;
  let service: UsersService;
  let repository: UsersRepository;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DataSource, useValue: dataSourceMock },
        {
          provide: 'UsersRepository',
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>('UsersRepository');
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserBalanceById', () => {
    // 사용자 잔액 조회
    it('should return current balance of a user', async () => {
      jest.spyOn(repository, 'getUserBalanceById').mockResolvedValue(userBalance);
      await expect(service.getUserBalanceById(userId)).resolves.toEqual(userBalance);
    });
  });

  describe('charge', () => {
    // 사용자 잔액 충전
    it('should return charge balance history', async () => {
      balanceHistory.type = charge;
      jest.useFakeTimers();
      jest.spyOn(repository, 'getUserBalanceById').mockResolvedValue(userBalance);
      jest.spyOn(repository, 'charge').mockResolvedValue(balanceHistory);
      await expect(service.charge(userId, amount)).resolves.toEqual(balanceHistory);
    });
  });

  describe('use', () => {
    // 사용자 잔액 사용
    it('should return use balance history', async () => {
      balanceHistory.type = use;
      jest.useFakeTimers();
      jest.spyOn(repository, 'getUserBalanceById').mockResolvedValue(userBalance);
      jest.spyOn(repository, 'use').mockResolvedValue(balanceHistory);
      await expect(service.charge(userId, amount)).resolves.toEqual(balanceHistory);
    });
  });

  describe('refund', () => {
    // 사용자 환불
    it('should return refund balance history', async () => {
      balanceHistory.type = refund;
      jest.useFakeTimers();
      jest.spyOn(repository, 'getUserBalanceById').mockResolvedValue(userBalance);
      jest.spyOn(repository, 'use').mockResolvedValue(balanceHistory);
      await expect(service.charge(userId, amount)).resolves.toEqual(balanceHistory);
    });
  });
});
