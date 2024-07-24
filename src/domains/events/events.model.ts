import { IsDate, IsNumber, IsString, ValidateIf, ValidateNested } from 'class-validator';

export class Event {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  starId: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  @ValidateIf((o) => o.deletedAt !== null)
  deletedAt: Date;
}

export class EventProperty {
  @IsNumber()
  id: number;

  @IsNumber()
  eventId: number;

  @IsDate()
  eventDate: Date;

  @IsNumber()
  seatCount: number;

  @IsDate()
  bookStartDate: Date;

  @IsDate()
  bookEndDate: Date;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  @ValidateIf((o) => o.deletedAt !== null)
  deletedAt: Date;

  @ValidateNested()
  event?: Event;
}
