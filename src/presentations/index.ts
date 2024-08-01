import { Type } from '@nestjs/common';
import { EventsController } from '@src/presentations/events/events.controller';
import { PaymentsController } from '@src/presentations/payments/payments.controller';
import { QueuesController } from '@src/presentations/queues/queues.controller';
import { ReservationssController } from '@src/presentations/reservations/reservations.controller';
import { SeatsController } from '@src/presentations/seats/seats.controller';
import { UsersController } from '@src/presentations/users/users.controller';

export const controllers: Type<any>[] = [
  EventsController,
  PaymentsController,
  QueuesController,
  ReservationssController,
  SeatsController,
  UsersController,
];
