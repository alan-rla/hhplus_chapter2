import { Type } from '@nestjs/common';
import { EventsFacade } from '@src/applications/events/events.facade';
import { PaymentsFacade } from '@src/applications/payments/payments.facade';
import { QueuesFacade } from '@src/applications/queues/queues.facade';
import { ReservationsFacade } from '@src/applications/reservations/reservations.facade';
import { SeatsFacade } from '@src/applications/seats/seats.facade';
import { UsersFacade } from '@src/applications/users/users.facade';

export const facades: Type<any>[] = [
  EventsFacade,
  PaymentsFacade,
  QueuesFacade,
  ReservationsFacade,
  SeatsFacade,
  UsersFacade,
];
