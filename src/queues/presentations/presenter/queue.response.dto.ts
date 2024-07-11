import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsUUID, validate } from 'class-validator';

enum QueueStatusEnum {
  STANDBY = 'STANDBY',
  ACTIVATED = 'ACTIVATED',
  EXPIRED = 'EXPIRED',
}

export class QueueResponseDto {
  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: 'ffd7a6d2-b742-4b7c-b7e4-a5e435435288',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({
    example: 'STANDBY',
    enum: QueueStatusEnum,
  })
  @IsEnum(QueueStatusEnum)
  @IsNotEmpty()
  status: QueueStatusEnum;

  @ApiProperty({
    example: '2024-07-08T06:38:02.060Z',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  constructor(args) {
    Object.assign(this, args);
  }

  static async fromDomain(queue) {
    const [error] = await validate(queue);
    if (error) throw error;
    return new QueueResponseDto(queue);
  }
}
