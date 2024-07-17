import { Expose } from 'class-transformer';
import { QueueStatusEnum } from '../../../libs/types';
import { IsDate, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';

export class QueueRequestProps {
  @Expose()
  @IsUUID()
  userId?: string;
  @Expose()
  @IsNumber()
  eventId: number;
  @Expose()
  @IsEnum(QueueStatusEnum)
  status?: QueueStatusEnum;
}

export class QueueResponseProps {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsUUID()
  userId: string;
  @Expose()
  @IsNumber()
  eventId: number;
  @Expose()
  @IsEnum(QueueStatusEnum)
  status: QueueStatusEnum;
  @Expose()
  @IsDate()
  createdAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
  @Expose()
  @IsDate()
  deletedAt: Date;
}

export class Queue {
  @Expose()
  @IsNumber()
  id: number;
  @Expose()
  @IsString()
  userId: string;
  @Expose()
  @IsNumber()
  eventId: number;
  @Expose()
  @IsEnum(QueueStatusEnum)
  status: QueueStatusEnum;
  @Expose()
  @IsDate()
  createdAt: Date;
  @Expose()
  @IsDate()
  updatedAt: Date;
  @Expose()
  @IsDate()
  deletedAt: Date;
}
