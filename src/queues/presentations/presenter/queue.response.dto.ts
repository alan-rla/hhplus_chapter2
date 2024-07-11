import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { QueueStatusEnum } from '../../../libs/types';

export class QueueResponseDto {
  @Expose()
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @Expose()
  @ApiProperty({
    example: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventId: number;

  @Expose()
  @ApiProperty({
    example: 'STANDBY',
    enum: QueueStatusEnum,
  })
  @IsEnum(QueueStatusEnum)
  @IsNotEmpty()
  status: QueueStatusEnum;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsOptional()
  deletedAt: Date;
}
