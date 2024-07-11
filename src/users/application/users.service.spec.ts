import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let module: TestingModule;
  let service: UsersService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserBalance', () => {
    // 공연 날짜 조회
    it('should return current balance of a user', async () => {
      const userId = 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288';
      await expect(service.getUserBalance({ userId })).resolves.toEqual([
        {
          id: 1,
          eventId,
          eventDate: dayjs(Date.now()).toDate(),
          seatCount: 50,
          bookStartDate: dayjs(Date.now()).toDate(),
          bookEndDate: dayjs(Date.now()).toDate(),
          createdAt: dayjs(Date.now()).toDate(),
          updatedAt: dayjs(Date.now()).toDate(),
          deletedAt: null,
        },
      ]);
    });
  });
});
