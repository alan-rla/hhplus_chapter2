import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import dayjs from 'dayjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@src/database/database.module';
import { DatabaseService } from '@src/database/database.service';
import {
  addTransactionalDataSource,
  getDataSourceByName,
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '@src/database/database.config';
import { BalanceTypeEnum } from '@src/libs/types';
import { UsersFacade } from '@src/applications/users/users.facade';
import { controllers } from '@src/presentations';
import { facades } from '@src/applications';
import { services } from '@src/domains';
import { repositories } from '@src/infrastructures';
import { guards } from '@src/libs/guards';

const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
const userBalance = {
  id: 1,
  userId,
  balance: 50000,
};
const amount = 50000;
const balanceHistory = {
  id: 1,
  userId,
  type: BalanceTypeEnum.CHARGE,
  amount,
  createdAt: dayjs(Date.now()).toDate(),
};

describe('UsersController', () => {
  let module: TestingModule;
  let controller: UsersController;
  let facade: UsersFacade;

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
      controllers: [...controllers],
      providers: [...facades, ...services, ...repositories, ...guards],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    facade = module.get<UsersFacade>(UsersFacade);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users/:userId/balance', () => {
    // 사용자 잔액 조회
    it('should return balance of a user', async () => {
      jest.spyOn(facade, 'getUserBalanceByUserId').mockResolvedValue(userBalance);
      await expect(controller.getUserBalance({ userId })).resolves.toEqual(userBalance);
    });
  });

  describe('PUT /users/{:userId}/balance/charge', () => {
    // 사용자 잔액 충전 + 충전 기록 반환
    it('should charge balance of a user and return charge history', async () => {
      jest.useFakeTimers();
      jest.spyOn(facade, 'charge').mockResolvedValue(balanceHistory);
      await expect(controller.chargeUserBalance({ userId }, { amount })).resolves.toEqual(balanceHistory);
    });
  });
});
