import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class GetEventPropertyDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  eventId: number;
}
