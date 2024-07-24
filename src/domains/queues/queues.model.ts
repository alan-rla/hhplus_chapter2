import { QueueStatusEnum } from '@src/libs/types';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

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

export class Queue {
  @IsNumber()
  id: number;

  @IsString()
  userId: string;

  @IsNumber()
  eventId: number;

  @IsEnum(QueueStatusEnum)
  status: QueueStatusEnum;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  @ValidateIf((o) => o.deletedAt !== null)
  deletedAt: Date;
}
