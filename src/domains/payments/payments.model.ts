import { IsNumber } from 'class-validator';

export class Payment {
  @IsNumber()
  id: number;

  @IsNumber()
  reservationId: number;

  @IsNumber()
  balanceHistoryId: number;
}
