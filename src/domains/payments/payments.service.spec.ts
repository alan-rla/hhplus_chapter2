import { Test, TestingModule } from '@nestjs/testing';
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
import { PaymentsService } from '@src/domains/payments/payments.service';
import { PaymentsRepository } from '@src/domains/repositories';
import { PaymentsRepositoryImpl } from '@src/infrastructures/payments/payments.repository';

const reservationId = 1;
const balanceHistoryId = 1;
const payment = {
  id: 1,
  reservationId,
  balanceHistoryId,
};

describe('PaymentsService', () => {
  let module: TestingModule;
  let service: PaymentsService;
  let repository: PaymentsRepository;

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
        PaymentsService,
        {
          provide: PaymentsRepository,
          useClass: PaymentsRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    repository = module.get<PaymentsRepository>(PaymentsRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('POST payment', () => {
    // 결재 기록 POST
    it('should return posted payment record', async () => {
      jest.spyOn(repository, 'postPayment').mockResolvedValue(payment);
      await expect(service.postPayment(reservationId, balanceHistoryId)).resolves.toEqual(payment);
    });
  });
});
