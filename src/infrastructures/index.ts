import { Provider } from '@nestjs/common';
import {
  EventsRepository,
  PaymentsRepository,
  QueuesRepository,
  RedisLocksRepository,
  ReservationsRepository,
  SeatsRepository,
  UsersRepository,
} from '@src/domains/repositories';
import { EventsRepositoryImpl } from '@src/infrastructures/events/events.repository';
import { PaymentsRepositoryImpl } from '@src/infrastructures/payments/payments.repository';
import { QueuesRepositoryImpl } from '@src/infrastructures/queues/queues.repository';
import { RedisLocksRepositoryImpl } from '@src/infrastructures/redis.locks/redis.locks.repository';
import { ReservationsRepositoryImpl } from '@src/infrastructures/reservations/reservations.repository';
import { SeatsRepositoryImpl } from '@src/infrastructures/seats/seats.repository';
import { UsersRepositoryImpl } from '@src/infrastructures/users/users.repository';

export const repositories: Provider[] = [
  {
    provide: QueuesRepository,
    useClass: QueuesRepositoryImpl,
  },
  {
    provide: UsersRepository,
    useClass: UsersRepositoryImpl,
  },
  {
    provide: EventsRepository,
    useClass: EventsRepositoryImpl,
  },
  {
    provide: PaymentsRepository,
    useClass: PaymentsRepositoryImpl,
  },
  {
    provide: SeatsRepository,
    useClass: SeatsRepositoryImpl,
  },
  {
    provide: ReservationsRepository,
    useClass: ReservationsRepositoryImpl,
  },
  {
    provide: RedisLocksRepository,
    useClass: RedisLocksRepositoryImpl,
  },
];
