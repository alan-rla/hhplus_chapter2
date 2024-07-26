import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { BalanceTypeEnum } from '@src/libs/types';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@src/database/database.module';
import { DatabaseService } from '@src/database/database.service';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { dataSourceOptions } from '@src/database/database.config';
import { HttpException } from '@nestjs/common';
import { UsersRepository } from '@src/domains/repositories';
import { UsersRepositoryImpl } from '@src/infrastructures/users/users.repository';

const balance = 50000;
const amount = 50000;
const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const userBalance = {
  id: 1,
  userId,
  balance,
};
const charge = BalanceTypeEnum.CHARGE;
const use = BalanceTypeEnum.USE;
const refund = BalanceTypeEnum.REFUND;
const balanceHistory = {
  id: 1,
  userId,
  type: null,
  amount,
  createdAt: expect.any(Date),
};

describe('UsersService', () => {
  let module: TestingModule;
  let service: UsersService;
  let repository: UsersRepository;

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
        UsersService,
        {
          provide: UsersRepository,
          useClass: UsersRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserBalanceById', () => {
    // 사용자 잔액 조회
    it('should return current balance of a user', async () => {
      jest.spyOn(repository, 'getUserBalanceByUserId').mockResolvedValue(userBalance);
      await expect(service.getUserBalanceByUserId(userId)).resolves.toEqual(userBalance);
    });
    // 사용자 잔액 정보 없음
    it('should throw error if user balance info does not exist', async () => {
      jest.spyOn(repository, 'getUserBalanceByUserId').mockResolvedValue(null);
      await expect(service.getUserBalanceByUserId(userId)).rejects.toThrow(
        new HttpException('USER_BALANCE_NOT_FOUND', 500),
      );
    });
  });

  describe('charge', () => {
    // 사용자 잔액 충전
    it('should return charge balance history', async () => {
      balanceHistory.type = charge;
      jest.spyOn(repository, 'putUserBalance').mockResolvedValue(true);
      jest.spyOn(repository, 'charge').mockResolvedValue(balanceHistory);
      await expect(service.charge(userId, balance, amount)).resolves.toEqual(balanceHistory);
    });
  });

  describe('use', () => {
    // 사용자 잔액 사용
    it('should return use balance history', async () => {
      balanceHistory.type = use;
      jest.spyOn(repository, 'putUserBalance').mockResolvedValue(true);
      jest.spyOn(repository, 'use').mockResolvedValue(balanceHistory);
      await expect(service.use(userId, balance, amount)).resolves.toEqual(balanceHistory);
    });
    // 사용자 잔액 부족
    it('should throw error if user balance is not enough', async () => {
      await expect(service.use(userId, 0, amount)).rejects.toThrow(new HttpException('NOT_ENOUGH_BALANCE', 500));
    });
  });

  describe('refund', () => {
    // 사용자 환불
    it('should return refund balance history', async () => {
      balanceHistory.type = refund;
      jest.spyOn(repository, 'putUserBalance').mockResolvedValue(true);
      jest.spyOn(repository, 'refund').mockResolvedValue(balanceHistory);
      await expect(service.refund(userId, balance, amount)).resolves.toEqual(balanceHistory);
    });
  });
});
