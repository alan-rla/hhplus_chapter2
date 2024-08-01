import { Event, EventProperty } from '@src/domains/events/events.model';
import { Payment } from '@src/domains/payments/payments.model';
import { Reservation } from '@src/domains/reservations/reservations.model';
import { Seat } from '@src/domains/seats/seats.model';
import { BalanceHistory, UserBalance } from '@src/domains/users/users.model';

export class RedisKey {
  static createCacheKey<T>(keyClass: new () => T, id?: number | string): string {
    switch (keyClass) {
      case Event:
        return `EVENT`; // fields: ${eventId}
      case EventProperty:
        return `EVENT#${id}:EVENT_PROPERTY`; // id = eventId, fields: ${eventPropertyId}
      case Seat:
        return `EVENT_PROPERTY#${id}:SEAT`; // id = eventPropertyId, fields: ${seatId}
      case UserBalance:
        return `USER_BALANCE:USER#${id}`; // id = userId
      case BalanceHistory:
        return `BALANCE_HISTORY:USER#${id}`; // id = userId, fields: ${balanceHistoryId}
      case Reservation:
        return `SEAT#${id}:RESERVATION`; // id = seatId, fields: ${reservationId}
      case Payment:
        return `RESERVATION#${id}:PAYMENT`; // id = reservationId, fields: ${paymentId}
    }
  }

  static createLockKey<T>(keyClass: new () => T, id?: number | string): string {
    switch (keyClass) {
      case EventProperty:
        return `EVENT_PROPERTY#${id}:LOCK`;
      case Seat:
        return `SEAT#{id}:LOCK`;
      case Reservation:
        return `RESERVATION#{id}:LOCK`;
    }
  }
}
