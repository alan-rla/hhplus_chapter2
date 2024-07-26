import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
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
import { EventsRepositoryImpl } from '@src/infrastructures/events/events.repository';
import { EventsRepository } from '@src/domains/repositories/events.repository';
import { HttpException } from '@nestjs/common';
import dayjs from 'dayjs';

const eventId = 1;
const event = {
  id: 1,
  name: '공연 이름',
  starId: 1,
  createdAt: dayjs(Date.now()).toDate(),
  updatedAt: dayjs(Date.now()).toDate(),
  deletedAt: null,
};
const eventProperty = {
  id: 1,
  eventId,
  eventDate: dayjs(Date.now()).toDate(),
  seatCount: 50,
  bookStartDate: dayjs(Date.now()).toDate(),
  bookEndDate: dayjs(Date.now()).toDate(),
  createdAt: dayjs(Date.now()).toDate(),
  updatedAt: dayjs(Date.now()).toDate(),
  deletedAt: null,
  event,
};

describe('EventsService', () => {
  let module: TestingModule;
  let service: EventsService;
  let repository: EventsRepository;

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
        EventsService,
        {
          provide: EventsRepository,
          useClass: EventsRepositoryImpl,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<EventsRepository>(EventsRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get all events', () => {
    // 공연 전체 검색 성공
    it('should return all events', async () => {
      jest.spyOn(repository, 'getAllEvents').mockResolvedValue([event]);
      await expect(service.getAllEvents()).resolves.toEqual([event]);
    });
  });

  describe('get one event by event id', () => {
    // 공연 검색 성공
    it('should return one event', async () => {
      jest.spyOn(repository, 'getEventById').mockResolvedValue(event);
      await expect(service.getEventById(eventId)).resolves.toEqual(event);
    });
    // 공연 검색 실패
    it('should fail to find event and throw error', async () => {
      jest.spyOn(repository, 'getEventById').mockResolvedValue(null);
      await expect(service.getEventById(eventId)).rejects.toThrow(new HttpException('EVENT_NOT_FOUND', 500));
    });
  });

  describe('get event properties by event id', () => {
    // 공연 속석 전체 검색 성공
    it('should return event properties', async () => {
      jest.spyOn(repository, 'getEventProperties').mockResolvedValue([eventProperty]);
      await expect(service.getEventProperties(eventId)).resolves.toEqual([eventProperty]);
    });
  });

  describe('get event property by property id', () => {
    // 공연 속성 검색 성공
    it('should return event properties', async () => {
      jest.spyOn(repository, 'getEventPropertyById').mockResolvedValue(eventProperty);
      await expect(service.getEventPropertyById(eventProperty.id)).resolves.toEqual(eventProperty);
    });
  });
});
