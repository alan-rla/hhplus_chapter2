import { Type } from '@nestjs/common';
import { EventsService } from '@src/domains/events/events.service';
import { PaymentsService } from '@src/domains/payments/payments.service';
import { QueuesService } from '@src/domains/queues/queues.service';
import { ReservationsService } from '@src/domains/reservations/reservations.service';
import { SeatsService } from '@src/domains/seats/seats.service';
import { UsersService } from '@src/domains/users/users.service';

export const services: Type<any>[] = [
  EventsService,
  PaymentsService,
  QueuesService,
  ReservationsService,
  SeatsService,
  UsersService,
];
