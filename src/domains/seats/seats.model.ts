import { SeatStatusEnum } from '@src/libs/types';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';

export class SeatProperty {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

export class Seat {
  @IsNumber()
  id: number;

  @IsNumber()
  seatNumber: number;

  @IsEnum(SeatStatusEnum)
  status: SeatStatusEnum;

  @IsNumber()
  eventPropertyId: number;

  @IsNumber()
  seatPropertyId: number;

  @ValidateNested()
  @Type(() => SeatProperty)
  seatProperty: SeatProperty;
}
