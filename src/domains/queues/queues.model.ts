import { QueueStatusEnum } from '@src/libs/types';
import { IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class QueueRequestProps {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsNumber()
  eventId: number;

  @IsEnum(QueueStatusEnum)
  @IsOptional()
  status?: QueueStatusEnum;
}

export class QueueTimeLeft {
  @IsNumber()
  minutesLeft: number;
}
