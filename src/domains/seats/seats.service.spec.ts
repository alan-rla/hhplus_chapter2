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
import { HttpException } from '@nestjs/common';
import { SeatStatusEnum } from '@src/libs/types';
import { SeatsService } from '@src/domains/seats/seats.service';
import { SeatsRepository } from '@src/domains/repositories';
import { SeatsRepositoryImpl } from '@src/infrastructures/seats/seats.repository';

const seatId = 1;
const eventPropertyId = 1;
const seat = {
  id: seatId,
  seatNumber: 1,
  status: null,
  eventPropertyId,
  seatPropertyId: 1,
  seatProperty: {
    id: 1,
    name: '스탠딩',
    price: 100000,
  },
};
const occupiedSeat = {
  id: seatId,
  seatNumber: 1,
  status: SeatStatusEnum.OCCUPIED,
  eventPropertyId,
  seatPropertyId: 1,
  seatProperty: {
    id: 1,
    name: '스탠딩',
    price: 100000,
  },
};

describe('SeatsService', () => {
  let module: TestingModule;
  let service: SeatsService;
  let repository: SeatsRepository;

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
        SeatsService,
        {
          provide: SeatsRepository,
          useClass: SeatsRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<SeatsService>(SeatsService);
    repository = module.get<SeatsRepository>(SeatsRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get seats by event property id', () => {
    // 좌석 조회 성공
    it('should return seats', async () => {
      jest.spyOn(repository, 'getSeats').mockResolvedValue([seat]);
      await expect(service.getSeatsByEventPropertyId(eventPropertyId)).resolves.toEqual([seat]);
    });
  });

  describe('get seat by id', () => {
    // 좌석 조회 성공
    it('should return a seat', async () => {
      jest.spyOn(repository, 'getSeatById').mockResolvedValue(seat);
      await expect(service.getSeatById(seatId)).resolves.toEqual(seat);
    });
    // 좌석 없음 예외처리
    it('should throw error if seat does not exist', async () => {
      jest.spyOn(repository, 'getSeatById').mockResolvedValue(null);
      await expect(service.getSeatById(seatId)).rejects.toThrow(new HttpException('SEAT_NOT_FOUND', 500));
    });
  });

  describe('put seat to occupied', () => {
    // 좌석 상태 변경 성공
    it('should return updated seat', async () => {
      seat.status = SeatStatusEnum.AVAILABLE;
      jest.spyOn(repository, 'putSeatStatus').mockResolvedValue(true);
      await expect(service.putSeatStatusToOccupied(seat)).resolves.toEqual(occupiedSeat);
    });
    // 좌석 상태 변경 실패
    it('should fail and throw error', async () => {
      await expect(service.putSeatStatusToOccupied(occupiedSeat)).rejects.toThrow(
        new HttpException('SEAT_OCCUPIED', 500),
      );
    });
  });
});
