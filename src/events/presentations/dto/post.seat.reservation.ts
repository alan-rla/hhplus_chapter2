import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class PostSeatReservationDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatId: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
