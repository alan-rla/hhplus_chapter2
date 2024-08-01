import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class QueueResponse {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  queue: boolean;
}

export class QueueTimeLeftResponse {
  @ApiProperty({
    example: 5,
  })
  @IsNumber()
  minutesLeft: number;
}
