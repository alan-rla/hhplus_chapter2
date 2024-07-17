import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../application/users.service';
import dayjs from 'dayjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/database.module';
import { DatabaseService } from '../../database/database.service';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../database/database.config';
import { UsersRepositoryImpl } from '../infrastructure/repositories/users.repository';
import { HttpException } from '@nestjs/common';
import { BalanceTypeEnum } from '../../libs/types';

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
  type: BalanceTypeEnum.CHARGE,
  amount,
  createdAt: dayjs(Date.now()).toDate(),
};

describe('UsersController', () => {
  let module: TestingModule;
  let controller: UsersController;
  let service: UsersService;

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
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: 'UsersRepository',
          useClass: UsersRepositoryImpl,
        },
      ],
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
    // 사용자 잔액 조회
    it('should return balance of a user', async () => {
      jest.spyOn(service, 'getUserBalanceById').mockResolvedValue(result);
      await expect(controller.getUserBalance({ userId })).resolves.toEqual(result);
    });
    // 사용자 잔액 정보 없음
    it('should throw error if user balance info does not exist', async () => {
      jest.spyOn(service, 'getUserBalanceById').mockRejectedValue(new HttpException('USER_BALANCE_NOT_FOUND', 500));
      await expect(controller.getUserBalance({ userId })).rejects.toThrow(
        new HttpException('USER_BALANCE_NOT_FOUND', 500),
      );
    });
  });

  describe('PUT /users/{:userId}/balance/charge', () => {
    // 사용자 잔액 충전 + 충전 기록 반환
    it('should charge balance of a user and return charge history', async () => {
      jest.useFakeTimers();
      jest.spyOn(service, 'charge').mockResolvedValue(result2);
      await expect(controller.chargeUserBalance({ userId }, { amount })).resolves.toEqual(result2);
    });
    // 사용자 잔액 정보 없음
    it('should throw error if user balance info does not exist', async () => {
      jest.spyOn(service, 'charge').mockRejectedValue(new HttpException('USER_BALANCE_NOT_FOUND', 500));
      await expect(controller.chargeUserBalance({ userId }, { amount })).rejects.toThrow(
        new HttpException('USER_BALANCE_NOT_FOUND', 500),
      );
    });
  });
});
