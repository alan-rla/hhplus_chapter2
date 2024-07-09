import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class SelectByRservationIdDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  reservationId: number;
}
