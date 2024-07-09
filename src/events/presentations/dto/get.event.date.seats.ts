import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class GetEventDateSeatsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  propertyId: number;
}
